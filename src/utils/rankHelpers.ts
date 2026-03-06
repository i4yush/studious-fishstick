/** Returns the emoji medal for ranks 1–3, or the formatted ordinal for others. */
export function rankLabel(rank: number): string {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return ordinal(rank);
}

/** Returns a string like "4th", "21st", "103rd". */
export function ordinal(n: number): string {
    const suffix = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (suffix[(v - 20) % 10] ?? suffix[v] ?? suffix[0] ?? 'th');
}

/** Returns a display colour token based on rank. */
export function rankColour(rank: number): string {
    if (rank === 1) return '#FFD700';  // Gold
    if (rank === 2) return '#C0C0C0';  // Silver
    if (rank === 3) return '#CD7F32';  // Bronze
    return '#8B5CF6';                  // Brand purple
}
