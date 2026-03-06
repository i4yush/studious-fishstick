/** Returns true if `date` is today (in local time). */
export function isToday(date: Date | string): boolean {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    return (
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
    );
}

/** Returns true if `date` was yesterday (in local time). */
export function isYesterday(date: Date | string): boolean {
    const d = typeof date === 'string' ? new Date(date) : date;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return (
        d.getDate() === yesterday.getDate() &&
        d.getMonth() === yesterday.getMonth() &&
        d.getFullYear() === yesterday.getFullYear()
    );
}

/** Returns a human-friendly relative label: "Just now", "2h ago", etc. */
export function timeAgo(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const diff = (Date.now() - d.getTime()) / 1000;

    if (diff < 60) return 'Just now';
    if (diff < 3_600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86_400) return `${Math.floor(diff / 3_600)}h ago`;
    if (diff < 604_800) return `${Math.floor(diff / 86_400)}d ago`;
    return d.toLocaleDateString();
}

/** Returns start of the current UTC week (Monday 00:00:00). */
export function startOfWeekUTC(): Date {
    const now = new Date();
    const day = now.getUTCDay(); // 0 = Sunday
    const diff = (day === 0 ? -6 : 1) - day;
    const monday = new Date(now);
    monday.setUTCDate(now.getUTCDate() + diff);
    monday.setUTCHours(0, 0, 0, 0);
    return monday;
}
