# RUNNR — Full App Build Task Checklist

## Phase 1 — Foundation
- [x] `constants/colors.ts` — brand tokens
- [x] `constants/fonts.ts` — font names
- [x] `constants/config.ts` — app config
- [x] `app/_layout.tsx` — update root layout (add Syne-800 font)
- [x] `components/brand/RunnrLogo.tsx` — SVG R route logo
- [x] `components/brand/LogoIcon.tsx` — small icon variant
- [x] `components/ui/Button.tsx` — primary/ghost/danger + haptic + spring
- [x] `components/ui/Card.tsx` — base card
- [x] `components/ui/Badge.tsx` — tag/badge
- [x] `components/ui/StatCard.tsx` — animated stat bar
- [x] `components/ui/ProgressBar.tsx` — animated XP bar
- [x] `components/ui/Avatar.tsx` — initials avatar
- [x] `types/zone.ts`, `types/run.ts`, `types/user.ts`

## Phase 2 — Supabase Schema (new tables)
- [/] Migration: `zones` table
- [/] Migration: `runs` table
- [/] Migration: `squads` table
- [/] Add `city`, `level`, `xp`, `streak`, `avatar_color` columns to `profiles`
- [/] Enable realtime on `zones`
- [ ] `src/supabase/client.ts` — verify supabase client exists

## Phase 3 — Onboarding screens
- [ ] `app/(onboarding)/index.tsx` — Splash (ripple rings, logo pop)
- [ ] `app/(onboarding)/city-select.tsx` — city picker
- [ ] `app/(onboarding)/level.tsx` — runner level
- [ ] `app/(onboarding)/goal.tsx` — weekly goal
- [ ] `app/(onboarding)/identity.tsx` — username + avatar color
- [ ] `app/(onboarding)/permissions.tsx` — location perms
- [ ] `app/(onboarding)/welcome.tsx` — welcome screen

## Phase 4 — Main Tabs (redesign with RUNNR brand)
- [x] `app/(app)/_layout.tsx` — update tab bar with RUNNR colors + icons
- [x] `app/(app)/dashboard/index.tsx` — Home (redesign with brand)
- [x] `app/(app)/map/index.tsx` — Territory Map tab (stubbed)
- [x] `app/(app)/leaderboard/index.tsx` — Leaderboard (redesign)
- [x] `app/(app)/squads/index.tsx` — Squads tab (new)
- [x] `app/(app)/profile/index.tsx` — Profile (redesign)

## Phase 5 — Run flow
- [ ] `app/run/index.tsx` — Active Run screen (stubbed map)
- [ ] `app/run/map.tsx` — Run Map
- [ ] `app/run/summary.tsx` — Post Run Summary
- [ ] `hooks/useRun.ts` — run state machine
- [ ] `hooks/useLocation.ts` — GPS wrapper
- [ ] `lib/territory.ts` — zone capture logic

## Phase 6 — Game / Secondary screens
- [ ] `app/game/zone/[id].tsx` — Zone detail
- [ ] `app/game/territory.tsx` — Territory analysis
- [ ] `app/rewards/index.tsx` — XP Hub (redesign)
- [ ] `app/rewards/loot-lab.tsx` — Loot Lab
- [ ] `app/quests/index.tsx` — Quest Log
- [ ] `app/social/leaderboard.tsx` — City leaderboard

## Phase 7 — Map components
- [x] `components/map/ZoneOverlay.tsx` (stubbed)
- [x] `components/map/RouteTracer.tsx` (stubbed)

## Phase 8 — Run components
- [ ] `components/run/LiveTicker.tsx`
- [ ] `components/run/PaceDisplay.tsx`
- [ ] `components/run/RunControls.tsx`

## Phase 9 — Home components
- [ ] `components/home/StreakPill.tsx`
- [ ] `components/home/XPProgress.tsx`
- [ ] `components/home/QuickActions.tsx`

## Phase 10 — Leaderboard components
- [ ] `components/leaderboard/LeaderboardRow.tsx`
- [ ] `components/leaderboard/LeaderboardFilter.tsx`
