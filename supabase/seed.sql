-- =============================================================================
-- Seed: Sample data for local development
-- =============================================================================

-- Sample badges
INSERT INTO public.badges (id, name, icon_url, condition_type, condition_value, tier)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'First Steps',      'badges/first-steps.png',  'xp_threshold',    100,  'free'),
  ('00000000-0000-0000-0000-000000000002', 'XP Seeker',        'badges/xp-seeker.png',    'xp_threshold',    500,  'free'),
  ('00000000-0000-0000-0000-000000000003', 'XP Master',        'badges/xp-master.png',    'xp_threshold',   2500,  'premium'),
  ('00000000-0000-0000-0000-000000000004', 'Week Warrior',     'badges/week-warrior.png', 'streak_days',       7,  'free'),
  ('00000000-0000-0000-0000-000000000005', 'Monthly Legend',   'badges/monthly.png',      'streak_days',      30,  'premium'),
  ('00000000-0000-0000-0000-000000000006', 'Reward Hunter',    'badges/reward-hunter.png','reward_claims',    10,  'free'),
  ('00000000-0000-0000-0000-000000000007', 'Social Butterfly', 'badges/social.png',       'social_referrals',  3,  'free')
ON CONFLICT (id) DO NOTHING;

-- Sample achievements
INSERT INTO public.achievements (id, name, description, xp_reward, badge_id)
VALUES
  ('10000000-0000-0000-0000-000000000001', 'Welcome Aboard',    'Complete your profile setup.',          50,  NULL),
  ('10000000-0000-0000-0000-000000000002', 'First Reward',      'Claim your first reward.',              100, '00000000-0000-0000-0000-000000000006'),
  ('10000000-0000-0000-0000-000000000003', 'Streak Starter',    'Maintain a 7-day streak.',              200, '00000000-0000-0000-0000-000000000004'),
  ('10000000-0000-0000-0000-000000000004', 'Rising Star',       'Reach 500 total XP.',                  150, '00000000-0000-0000-0000-000000000002'),
  ('10000000-0000-0000-0000-000000000005', 'Connector',         'Refer 3 friends to the platform.',     300, '00000000-0000-0000-0000-000000000007')
ON CONFLICT (id) DO NOTHING;

-- Sample rewards
INSERT INTO public.rewards (id, title, description, xp_cost, tier, is_active)
VALUES
  ('20000000-0000-0000-0000-000000000001', 'Coffee Voucher',       '10% off at partner cafes.',            200,  'free',    true),
  ('20000000-0000-0000-0000-000000000002', 'App Theme: Dark Gold', 'Exclusive dark-gold colour scheme.',   500,  'free',    true),
  ('20000000-0000-0000-0000-000000000003', 'Premium Avatar Frame', 'Animated avatar border for premium.',  0,    'premium', true),
  ('20000000-0000-0000-0000-000000000004', 'XP Booster (2x, 24h)','Double XP for 24 hours.',             1000,  'premium', true),
  ('20000000-0000-0000-0000-000000000005', 'Streak Shield',        'Protect your streak once.',            750,  'premium', true)
ON CONFLICT (id) DO NOTHING;
