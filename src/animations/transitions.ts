import { Easing } from 'react-native-reanimated';
import type { WithSpringConfig, WithTimingConfig } from 'react-native-reanimated';

/** Standard spring for card/modal entrances. */
export const springMedium: WithSpringConfig = {
    damping: 18,
    stiffness: 200,
    mass: 1,
};

/** Snappier spring for quick UI interactions. */
export const springSnappy: WithSpringConfig = {
    damping: 24,
    stiffness: 300,
    mass: 0.8,
};

/** Slow, smooth spring for large modal reveals. */
export const springGentle: WithSpringConfig = {
    damping: 30,
    stiffness: 120,
    mass: 1.2,
};

/** Standard fade timing. */
export const fadeInTiming: WithTimingConfig = {
    duration: 250,
};

export const fadeOutTiming: WithTimingConfig = {
    duration: 180,
};

/** Standard page transition duration (ms). */
export const PAGE_TRANSITION_DURATION = 300;

// ---------------------------------------------------------------------------
// Onboarding animation configs
// ---------------------------------------------------------------------------

/** Logo SVG draw-on — cubic ease-out over 1.2s */
export const logoDrawTiming: WithTimingConfig = {
    duration: 1200,
    easing: Easing.out(Easing.cubic),
};

/** Route trace SVG animation — cubic ease-out over 1.8s */
export const routeTraceTiming: WithTimingConfig = {
    duration: 1800,
    easing: Easing.out(Easing.cubic),
};

/** CTA button press feedback — fast (80ms) */
export const ctaPressTiming: WithTimingConfig = {
    duration: 80,
};

/** Stats counter number roll-up — quad ease-out over 800ms */
export const statsCountTiming: WithTimingConfig = {
    duration: 800,
    easing: Easing.out(Easing.quad),
};
