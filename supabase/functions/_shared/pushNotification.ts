const EXPO_PUSH_ENDPOINT = 'https://exp.host/--/api/v2/push/send';

export interface PushMessage {
    to: string;
    title: string;
    body: string;
    data?: Record<string, unknown>;
    sound?: 'default' | null;
    badge?: number;
}

export interface PushTicket {
    status: 'ok' | 'error';
    id?: string;
    message?: string;
    details?: { error?: string };
}

/**
 * Sends one or more Expo push notifications.
 * Returns the push tickets for further receipt processing.
 */
export async function sendExpoPushNotifications(
    messages: PushMessage[],
): Promise<PushTicket[]> {
    const response = await fetch(EXPO_PUSH_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(messages),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Expo push API error: ${text}`);
    }

    const json = await response.json() as { data: PushTicket[] };
    return json.data;
}
