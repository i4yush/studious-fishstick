/** Formats a raw XP number for display, e.g. 1500 → "1.5K" */
export function formatXP(xp: number): string {
    if (xp >= 1_000_000) return `${(xp / 1_000_000).toFixed(1)}M`;
    if (xp >= 1_000) return `${(xp / 1_000).toFixed(1)}K`;
    return xp.toString();
}

/** Returns percentage completion toward the next XP tier. */
export function xpProgress(current: number, target: number): number {
    if (target <= 0) return 0;
    return Math.min(Math.floor((current / target) * 100), 100);
}

const XP_TIERS = [0, 100, 500, 1_000, 2_500, 5_000, 10_000, 25_000, 50_000, 100_000];
const TIER_NAMES = ['Rookie', 'Starter', 'Explorer', 'Achiever', 'Challenger', 'Elite', 'Champion', 'Legend', 'Master', 'Grandmaster'];

/** Returns the display name for the current XP tier. */
export function xpTierName(xp: number): string {
    let tier = 0;
    for (let i = 0; i < XP_TIERS.length; i++) {
        if (xp >= (XP_TIERS[i] ?? 0)) tier = i;
    }
    return TIER_NAMES[tier] ?? 'Rookie';
}

/** XP required to reach the next tier from the given total. */
export function xpToNextTier(xp: number): number | null {
    for (const threshold of XP_TIERS) {
        if (xp < threshold) return threshold - xp;
    }
    return null; // Max tier reached
}
