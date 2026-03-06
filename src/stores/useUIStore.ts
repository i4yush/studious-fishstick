import { create } from 'zustand';

export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
}

interface UIState {
    // Modals
    isRewardModalOpen: boolean;
    rewardModalId: string | null;
    isBadgeModalOpen: boolean;
    badgeModalId: string | null;
    isPaywallOpen: boolean;

    // Toasts
    toasts: Toast[];

    // Global loading
    isLoading: boolean;

    // Actions
    openRewardModal: (id: string) => void;
    closeRewardModal: () => void;
    openBadgeModal: (id: string) => void;
    closeBadgeModal: () => void;
    openPaywall: () => void;
    closePaywall: () => void;
    addToast: (message: string, type?: Toast['type']) => void;
    removeToast: (id: string) => void;
    setLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
    isRewardModalOpen: false,
    rewardModalId: null,
    isBadgeModalOpen: false,
    badgeModalId: null,
    isPaywallOpen: false,
    toasts: [],
    isLoading: false,

    openRewardModal: (id) => set({ isRewardModalOpen: true, rewardModalId: id }),
    closeRewardModal: () => set({ isRewardModalOpen: false, rewardModalId: null }),

    openBadgeModal: (id) => set({ isBadgeModalOpen: true, badgeModalId: id }),
    closeBadgeModal: () => set({ isBadgeModalOpen: false, badgeModalId: null }),

    openPaywall: () => set({ isPaywallOpen: true }),
    closePaywall: () => set({ isPaywallOpen: false }),

    addToast: (message, type = 'info') =>
        set((state) => ({
            toasts: [
                ...state.toasts,
                { id: Date.now().toString(), message, type },
            ],
        })),

    removeToast: (id) =>
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
        })),

    setLoading: (isLoading) => set({ isLoading }),
}));
