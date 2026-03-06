import { supabase } from '@/supabase/client';

const AVATAR_BUCKET = 'avatars';
const BADGE_BUCKET = 'badges';

export const storageService = {
    /**
     * Uploads a user avatar as a signed upload.
     * Client uploads directly to Storage; the public URL is CDN-backed.
     */
    uploadAvatar: async (userId: string, fileUri: string): Promise<string> => {
        const response = await fetch(fileUri);
        const blob = await response.blob();
        const ext = fileUri.split('.').pop() ?? 'webp';
        const path = `${userId}.${ext}`;

        const { error } = await supabase.storage
            .from(AVATAR_BUCKET)
            .upload(path, blob, { upsert: true, contentType: `image/${ext}` });

        if (error) throw error;

        const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
        return data.publicUrl;
    },

    getAvatarUrl: (userId: string, ext = 'webp'): string => {
        const { data } = supabase.storage
            .from(AVATAR_BUCKET)
            .getPublicUrl(`${userId}.${ext}`);
        return data.publicUrl;
    },

    getBadgeIconUrl: (badgeId: string): string => {
        const { data } = supabase.storage
            .from(BADGE_BUCKET)
            .getPublicUrl(`${badgeId}.png`);
        return data.publicUrl;
    },

    deleteAvatar: async (userId: string, ext = 'webp'): Promise<void> => {
        const { error } = await supabase.storage
            .from(AVATAR_BUCKET)
            .remove([`${userId}.${ext}`]);
        if (error) throw error;
    },
};
