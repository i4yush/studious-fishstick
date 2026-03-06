import PostHog from 'posthog-react-native';

// ---------------------------------------------------------------------------
// Initialise PostHog once. Swap this client for Firebase Analytics by
// replacing the implementation of each exported function below — call sites
// never need to change.
// ---------------------------------------------------------------------------
let client: PostHog | null = null;

function getClient(): PostHog {
    if (!client) {
        client = new PostHog(
            process.env.EXPO_PUBLIC_POSTHOG_API_KEY ?? '',
            { host: 'https://app.posthog.com' },
        );
    }
    return client;
}

type EventProperties = Record<string, string | number | boolean | null | undefined>;

export const analyticsService = {
    identify: (userId: string, properties?: EventProperties): void => {
        getClient().identify(userId, properties);
    },

    track: (event: string, properties?: EventProperties): void => {
        getClient().capture(event, properties);
    },

    screen: (screenName: string, properties?: EventProperties): void => {
        getClient().screen(screenName, properties);
    },

    reset: (): void => {
        getClient().reset();
    },

    // ------- Typed event helpers -------
    appOpened: (sessionId: string, platform: string): void => {
        analyticsService.track('app_opened', { session_id: sessionId, platform });
    },

    onboardingStepCompleted: (stepName: string): void => {
        analyticsService.track('onboarding_step_completed', { step_name: stepName });
    },

    xpEarned: (amount: number, source: string): void => {
        analyticsService.track('xp_earned', { amount, source });
    },

    badgeUnlocked: (badgeId: string, badgeName: string): void => {
        analyticsService.track('badge_unlocked', { badge_id: badgeId, badge_name: badgeName });
    },

    rewardClaimed: (rewardId: string, tier: string): void => {
        analyticsService.track('reward_claimed', { reward_id: rewardId, tier });
    },

    leaderboardViewed: (period: string): void => {
        analyticsService.track('leaderboard_viewed', { period });
    },

    subscriptionStarted: (plan: string, price: number): void => {
        analyticsService.track('subscription_started', { plan, price });
    },

    subscriptionCancelled: (plan: string, daysActive: number): void => {
        analyticsService.track('subscription_cancelled', { plan, days_active: daysActive });
    },

    notificationTapped: (notificationType: string): void => {
        analyticsService.track('notification_tapped', { notification_type: notificationType });
    },
};
