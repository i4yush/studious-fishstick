-- =============================================================================
-- Migration: 001_initial_schema
-- Description: Full schema for PROJECT-RUN gamification app
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
CREATE TYPE xp_source AS ENUM (
  'daily_login', 'reward_claimed', 'badge_unlocked',
  'achievement_completed', 'referral', 'streak_bonus'
);

CREATE TYPE reward_tier AS ENUM ('free', 'premium');

CREATE TYPE leaderboard_period AS ENUM ('weekly', 'alltime');

CREATE TYPE device_platform AS ENUM ('ios', 'android');

CREATE TYPE subscription_plan AS ENUM ('free', 'monthly', 'annual');

CREATE TYPE subscription_status AS ENUM ('active', 'expired', 'cancelled', 'trial');

CREATE TYPE badge_condition_type AS ENUM (
  'xp_threshold', 'streak_days', 'reward_claims', 'social_referrals'
);

CREATE TYPE notification_type AS ENUM (
  'badge_unlocked', 'xp_milestone', 'streak_risk', 'streak_lost',
  'rank_change', 'friend_joined', 'reward_expiring'
);

-- ---------------------------------------------------------------------------
-- Helper: auto-update updated_at
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- Table: users (mirrors auth.users, populated by trigger)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_email ON public.users (email);

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- Table: profiles
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  username    TEXT UNIQUE,
  avatar_url  TEXT,
  bio         TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_username ON public.profiles (username);

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- Table: xp_logs
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.xp_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount      INTEGER NOT NULL CHECK (amount > 0),
  source      xp_source NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_xp_logs_user_id     ON public.xp_logs (user_id);
CREATE INDEX idx_xp_logs_created_at  ON public.xp_logs (created_at);

-- ---------------------------------------------------------------------------
-- Table: rewards
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rewards (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  description  TEXT NOT NULL,
  xp_cost      INTEGER NOT NULL DEFAULT 0 CHECK (xp_cost >= 0),
  tier         reward_tier NOT NULL DEFAULT 'free',
  is_active    BOOLEAN NOT NULL DEFAULT true,
  image_url    TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_rewards_tier_active ON public.rewards (tier, is_active);

CREATE TRIGGER trg_rewards_updated_at
  BEFORE UPDATE ON public.rewards
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- Table: user_rewards
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_rewards (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reward_id   UUID NOT NULL REFERENCES public.rewards(id) ON DELETE CASCADE,
  claimed_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_rewards UNIQUE (user_id, reward_id)
);

CREATE INDEX idx_user_rewards_user_id ON public.user_rewards (user_id);

-- ---------------------------------------------------------------------------
-- Table: badges
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.badges (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  icon_url         TEXT NOT NULL,
  condition_type   badge_condition_type NOT NULL,
  condition_value  INTEGER NOT NULL,
  tier             reward_tier NOT NULL DEFAULT 'free',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_badges_condition_type ON public.badges (condition_type);

-- ---------------------------------------------------------------------------
-- Table: user_badges
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_badges (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  badge_id     UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  unlocked_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_badges UNIQUE (user_id, badge_id)
);

CREATE INDEX idx_user_badges_user_id ON public.user_badges (user_id);

-- ---------------------------------------------------------------------------
-- Table: achievements
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.achievements (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  description  TEXT NOT NULL,
  xp_reward    INTEGER NOT NULL DEFAULT 0,
  badge_id     UUID REFERENCES public.badges(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Table: user_achievements
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  achievement_id  UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  progress        INTEGER NOT NULL DEFAULT 0,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_achievements_user_id ON public.user_achievements (user_id);

-- ---------------------------------------------------------------------------
-- Table: leaderboard
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leaderboard (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  total_xp    INTEGER NOT NULL DEFAULT 0,
  rank        INTEGER NOT NULL DEFAULT 0,
  period      leaderboard_period NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_leaderboard_user_period UNIQUE (user_id, period)
);

-- Partial indexes per the performance section
CREATE INDEX idx_leaderboard_weekly  ON public.leaderboard (total_xp DESC) WHERE period = 'weekly';
CREATE INDEX idx_leaderboard_alltime ON public.leaderboard (total_xp DESC) WHERE period = 'alltime';
CREATE INDEX idx_leaderboard_user_id ON public.leaderboard (user_id);

-- ---------------------------------------------------------------------------
-- Table: subscriptions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  revenuecat_id   TEXT NOT NULL UNIQUE,
  plan            subscription_plan NOT NULL DEFAULT 'free',
  status          subscription_status NOT NULL DEFAULT 'active',
  expires_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_subscriptions_user_status ON public.subscriptions (user_id, status);

CREATE TRIGGER trg_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- Table: notifications
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type        notification_type NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  read        BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user_read ON public.notifications (user_id, read);
CREATE INDEX idx_notifications_created   ON public.notifications (created_at DESC);

-- ---------------------------------------------------------------------------
-- Table: push_tokens
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.push_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  token       TEXT NOT NULL,
  platform    device_platform NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_push_token UNIQUE (user_id, platform)
);

CREATE INDEX idx_push_tokens_user_id ON public.push_tokens (user_id);

CREATE TRIGGER trg_push_tokens_updated_at
  BEFORE UPDATE ON public.push_tokens
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- Table: streaks
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.streaks (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  current_streak    INTEGER NOT NULL DEFAULT 0,
  longest_streak    INTEGER NOT NULL DEFAULT 0,
  last_activity_at  TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_streaks_updated_at
  BEFORE UPDATE ON public.streaks
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- Table: leaderboard_history (weekly archive)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leaderboard_history (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  total_xp     INTEGER NOT NULL,
  rank         INTEGER NOT NULL,
  period_end   DATE NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lb_history_period ON public.leaderboard_history (period_end DESC);

-- ---------------------------------------------------------------------------
-- Auth trigger: on_auth_user_created
-- Auto-creates users + profiles + leaderboard rows + streaks on signup
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.leaderboard (user_id, period)
  VALUES (NEW.id, 'weekly'), (NEW.id, 'alltime')
  ON CONFLICT (user_id, period) DO NOTHING;

  INSERT INTO public.streaks (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Functions: Leaderboard Operations
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.increment_leaderboard_xp(p_user_id UUID, p_amount INTEGER)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Update alltime
  INSERT INTO public.leaderboard (user_id, total_xp, period)
  VALUES (p_user_id, p_amount, 'alltime')
  ON CONFLICT (user_id, period) DO UPDATE
  SET total_xp = leaderboard.total_xp + p_amount,
      updated_at = now();

  -- Update weekly
  INSERT INTO public.leaderboard (user_id, total_xp, period)
  VALUES (p_user_id, p_amount, 'weekly')
  ON CONFLICT (user_id, period) DO UPDATE
  SET total_xp = leaderboard.total_xp + p_amount,
      updated_at = now();
END;
$$;

CREATE OR REPLACE FUNCTION public.recalculate_leaderboard_ranks()
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Update weekly ranks
  WITH ranked AS (
    SELECT id, RANK() OVER (ORDER BY total_xp DESC) as new_rank
    FROM public.leaderboard
    WHERE period = 'weekly'
  )
  UPDATE public.leaderboard l
  SET rank = r.new_rank,
      updated_at = now()
  FROM ranked r
  WHERE l.id = r.id;

  -- Update alltime ranks
  WITH ranked AS (
    SELECT id, RANK() OVER (ORDER BY total_xp DESC) as new_rank
    FROM public.leaderboard
    WHERE period = 'alltime'
  )
  UPDATE public.leaderboard l
  SET rank = r.new_rank,
      updated_at = now()
  FROM ranked r
  WHERE l.id = r.id;
END;
$$;

-- ---------------------------------------------------------------------------
-- RLS: Enable and define core policies
-- ---------------------------------------------------------------------------

-- users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_select_own" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (auth.uid() = id);

-- profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_all"  ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_update_own"  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- xp_logs
ALTER TABLE public.xp_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "xp_logs_select_own" ON public.xp_logs FOR SELECT USING (auth.uid() = user_id);
-- INSERT / UPDATE allowed only via service_role (Edge Functions); no client policy.

-- rewards
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rewards_select_active" ON public.rewards FOR SELECT TO authenticated USING (is_active = true);

-- user_rewards
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_rewards_select_own" ON public.user_rewards FOR SELECT USING (auth.uid() = user_id);

-- badges
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "badges_select_all" ON public.badges FOR SELECT TO authenticated USING (true);

-- user_badges
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_badges_select_all" ON public.user_badges FOR SELECT TO authenticated USING (true);

-- achievements
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "achievements_select_all" ON public.achievements FOR SELECT TO authenticated USING (true);

-- user_achievements
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_achievements_select_own" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);

-- leaderboard
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leaderboard_select_all" ON public.leaderboard FOR SELECT TO authenticated USING (true);

-- subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subscriptions_select_own" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- push_tokens
ALTER TABLE public.push_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "push_tokens_select_own" ON public.push_tokens FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "push_tokens_upsert_own" ON public.push_tokens FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "push_tokens_update_own" ON public.push_tokens FOR UPDATE USING (auth.uid() = user_id);

-- streaks
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "streaks_select_own"   ON public.streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "streaks_select_board" ON public.streaks FOR SELECT TO authenticated USING (true);

-- leaderboard_history
ALTER TABLE public.leaderboard_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lb_history_select_all" ON public.leaderboard_history FOR SELECT TO authenticated USING (true);

-- ---------------------------------------------------------------------------
-- pg_cron schedules (standard Supabase net extension pattern)
-- ---------------------------------------------------------------------------

-- We use a generic approach, standardizing on common secret naming
-- Note: These rely on the Edge Functions being deployed with these names.

-- Recalculate weekly ranks every 5 minutes
SELECT cron.schedule(
  'update-leaderboard-ranks',
  '*/5 * * * *',
  $$
  SELECT
    net.http_post(
      url:='http://localhost:54321/functions/v1/update-leaderboard',
      headers:=jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('vault.service_role_key', true)
      ),
      body:='{}'::jsonb
    );
  $$
);

-- Reset weekly leaderboard every Monday at 00:00 UTC
SELECT cron.schedule(
  'reset-weekly-leaderboard',
  '0 0 * * 1',
  $$
  SELECT
    net.http_post(
      url:='http://localhost:54321/functions/v1/reset-weekly-leaderboard',
      headers:=jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('vault.service_role_key', true)
      ),
      body:='{}'::jsonb
    );
  $$
);

-- Streak-risk reminder every day at 20:00 UTC
SELECT cron.schedule(
  'streak-risk-notification',
  '0 20 * * *',
  $$
  SELECT
    net.http_post(
      url:='http://localhost:54321/functions/v1/send-streak-risk',
      headers:=jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('vault.service_role_key', true)
      ),
      body:='{}'::jsonb
    );
  $$
);
