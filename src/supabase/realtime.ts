import { supabase } from './client';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type TableName = string;
type ChangeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

export interface ChannelOptions {
    table: TableName;
    event?: ChangeEvent;
    filter?: string;
    onData: (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void;
}

/**
 * Factory that creates a typed Supabase Realtime channel.
 * Call `.subscribe()` on the returned channel and `.unsubscribe()` on cleanup.
 */
export function createRealtimeChannel(
    channelName: string,
    options: ChannelOptions,
): RealtimeChannel {
    return supabase
        .channel(channelName)
        .on(
            'postgres_changes',
            {
                event: options.event ?? '*',
                schema: 'public',
                table: options.table,
                filter: options.filter,
            },
            options.onData,
        );
}

/** Removes all active channels (call on sign-out). */
export async function removeAllChannels(): Promise<void> {
    await supabase.removeAllChannels();
}
