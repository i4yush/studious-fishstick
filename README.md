# PROJECT-RUN

# Project Structure

```
app/                    # Expo Router file-based routes
src/
  components/           # UI primitives, gamification, leaderboard, shared
  screens/              # Full screen components consumed by routes
  hooks/                # Custom React hooks
  stores/               # Zustand state slices
  queries/              # TanStack Query hooks
  services/             # Supabase & third-party service wrappers
  supabase/             # Supabase client, types, realtime
  animations/           # Moti / Lottie animation components
  utils/                # Pure helpers
supabase/
  migrations/           # SQL migration files
  functions/            # Deno Edge Functions
  seed.sql
assets/
  fonts/
  images/
  lottie/               # .json Lottie files
```

# Getting Started

## 1. Install Dependencies
```bash
npm install
```

## 2. Set Up Environment
```bash
cp .env.example .env
# Fill in your Supabase URL, anon key, RevenueCat keys, etc.
```

## 3. Set Up Supabase (local)
```bash
npx supabase start
npx supabase db reset        # Applies migrations + seed
```

## 4. Set Up Supabase (cloud)
```bash
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push          # Applies migrations to production
npx supabase functions deploy award-xp
npx supabase functions deploy unlock-badge
npx supabase functions deploy update-leaderboard
npx supabase functions deploy send-notification
npx supabase functions deploy stripe-webhook
```

## 5. Regenerate Types
```bash
npm run types:generate
```

## 6. Start Dev Server
```bash
npm start
```

# EAS Builds
```bash
# Development build (use with Expo Dev Client)
eas build --profile development --platform ios

# Preview build (internal TestFlight / internal track)
eas build --profile preview --platform all

# Production build
eas build --profile production --platform all
eas submit --platform all
```

# Tech Stack

| Layer | Technology |
|---|---|
| Framework | Expo (React Native) with Expo Router |
| Styling | NativeWind (Tailwind CSS for RN) |
| Animations | Reanimated 3, Moti, Lottie |
| State (UI) | Zustand |
| State (Server) | TanStack Query v5 |
| Backend | Supabase (Auth, DB, Storage, Edge Functions, Realtime) |
| Notifications | Expo Notifications + FCM |
| Monetization | RevenueCat |
| Analytics | PostHog |
| CI/CD | EAS Build + EAS Update |

# Environment Variables

See `.env.example` for all required variables.
Never commit `.env` to source control.
Edge Function secrets should be set with `supabase secrets set`.
