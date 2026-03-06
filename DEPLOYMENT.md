# PROJECT-RUN — Deployment Variables Reference

> [!IMPORTANT]
> Never commit `.env` or any file containing real credentials to version control.
> Set CI/CD secrets in your EAS project dashboard and pipeline secrets manager.

---

## Required Environment Variables

### 1. Local Development (`.env`)

Copy `.env.example` → `.env` and fill in real values before running `expo start`.

| Variable | Description | Example |
|---|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project REST URL | `https://abcxyz.supabase.co` |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | `eyJhbGc...` |
| `EXPO_PUBLIC_EAS_PROJECT_ID` | EAS project UUID (from `eas init`) | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |
| `EXPO_PUBLIC_REVENUECAT_IOS` | RevenueCat iOS API key | `appl_...` |
| `EXPO_PUBLIC_REVENUECAT_ANDROID` | RevenueCat Android API key | `goog_...` |
| `EXPO_PUBLIC_POSTHOG_API_KEY` | PostHog analytics key | `phc_...` |

### 2. EAS Build CI Secrets

Set via `eas secret:create --scope project --name KEY --value VALUE` or the EAS dashboard.

| Secret Name | Used In | Description |
|---|---|---|
| `EXPO_PUBLIC_EAS_PROJECT_ID` | `app.config.js` | EAS project UUID |
| `EXPO_PUBLIC_SUPABASE_URL` | Runtime | Supabase URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Runtime | Supabase anon key |
| `EXPO_PUBLIC_REVENUECAT_IOS` | Runtime | RevenueCat iOS key |
| `EXPO_PUBLIC_REVENUECAT_ANDROID` | Runtime | RevenueCat Android key |
| `EXPO_PUBLIC_POSTHOG_API_KEY` | Runtime | PostHog key |

### 3. EAS Submit CI Secrets (iOS App Store)

Set as EAS secrets or pipeline environment variables. Referenced in `eas.json` via `$VAR` syntax.

| Secret Name | Description |
|---|---|
| `APPLE_ID` | Apple ID email used for App Store Connect |
| `ASC_APP_ID` | App Store Connect numeric App ID |
| `APPLE_TEAM_ID` | Apple Developer Team ID (10-char alphanumeric) |

> Finding your values:
> - **APPLE_ID**: Your Apple ID email (e.g. `you@example.com`)
> - **ASC_APP_ID**: App Store Connect → Your App → App Information → Apple ID field
> - **APPLE_TEAM_ID**: developer.apple.com → Account → Membership → Team ID

### 4. EAS Submit CI Secrets (Android Play Store)

| File / Secret | Description |
|---|---|
| `google-play-key.json` | Service account JSON with Play Store publish permissions. Keep outside repo or in CI secret store. |

---

## How to Obtain Your EAS Project ID

```bash
npx eas-cli@latest init
# This registers the project and writes the projectId into app.config.js automatically.
# Alternatively, copy the UUID from expo.dev → your project → Settings.
```

---

## Firebase / Google Services

| File | Platform | Source |
|---|---|---|
| `GoogleService-Info.plist` | iOS | Firebase Console → Project Settings → iOS app |
| `google-services.json` | Android | Firebase Console → Project Settings → Android app |

These files are gitignored. Store them as CI secret files or inject via EAS Secrets.
