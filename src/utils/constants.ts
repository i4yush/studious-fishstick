// ---------------------------------------------------------------------------
// App-wide constants
// ---------------------------------------------------------------------------

export const APP_NAME = 'PROJECT-RUN';
export const APP_SCHEME = 'projectrun';

// Supabase
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

// RevenueCat
export const REVENUECAT_API_KEY_IOS = process.env.EXPO_PUBLIC_REVENUECAT_IOS ?? '';
export const REVENUECAT_API_KEY_ANDROID = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID ?? '';

// PostHog
export const POSTHOG_API_KEY = process.env.EXPO_PUBLIC_POSTHOG_API_KEY ?? '';

// Storage buckets
export const BUCKET_AVATARS = 'avatars';
export const BUCKET_BADGES = 'badges';
export const BUCKET_MEDIA = 'media';
export const BUCKET_LOTTIE = 'lottie';

// Query keys (centralised to avoid typos)
export const QK = {
    PROFILE: 'profile',
    LEADERBOARD: 'leaderboard',
    REWARDS: 'rewards',
    BADGES: 'badges',
    USER_BADGES: 'user-badges',
    NOTIFICATIONS: 'notifications',
    SUBSCRIPTION: 'subscription',
    STREAKS: 'streaks',
} as const;

// XP
export const XP_PER_DAILY_LOGIN = 50;
export const XP_PER_REWARD_CLAIM = 100;
export const XP_PREMIUM_MULTIPLIER = 2;

// Pagination
export const LEADERBOARD_PAGE_SIZE = 20;
export const NOTIFICATIONS_PAGE_SIZE = 50;
