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
