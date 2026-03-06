import { create } from 'zustand';

interface XPState {
    /** Displayed XP total (optimistic — may be ahead of server). */
    displayXP: number;
    /** True while an XP animation is playing. */
    isAnimating: boolean;
    /** The increment amount shown in the pop animation. */
    pendingXPGain: number;

    // Actions
    setDisplayXP: (total: number) => void;
    addOptimisticXP: (amount: number) => void;
    confirmXP: (serverTotal: number) => void;
    rollbackXP: (previousTotal: number) => void;
    triggerAnimation: (amount: number) => void;
    clearAnimation: () => void;
}

export const useXPStore = create<XPState>((set) => ({
    displayXP: 0,
    isAnimating: false,
    pendingXPGain: 0,

    setDisplayXP: (total) => set({ displayXP: total }),

    /** Optimistically add XP before server confirms; shows animation. */
    addOptimisticXP: (amount) =>
        set((state) => ({
            displayXP: state.displayXP + amount,
            isAnimating: true,
            pendingXPGain: amount,
        })),

    /** Called when server responds with the confirmed total. */
    confirmXP: (serverTotal) =>
        set({ displayXP: serverTotal, isAnimating: false, pendingXPGain: 0 }),

    /** Called on mutation error — revert to the known-good state. */
    rollbackXP: (previousTotal) =>
        set({ displayXP: previousTotal, isAnimating: false, pendingXPGain: 0 }),

    triggerAnimation: (amount) =>
        set({ isAnimating: true, pendingXPGain: amount }),

    clearAnimation: () => set({ isAnimating: false, pendingXPGain: 0 }),
}));
