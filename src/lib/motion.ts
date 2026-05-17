// Shared motion tokens — single source of truth for easings + durations.
// Keeps the editorial rhythm consistent across pages and components.

export const EASE_STANDARD = [0.215, 0.61, 0.355, 1] as const; // ease-out cubic — reveals, scroll-in, page transitions
export const EASE_SNAPPY = [0.32, 0.72, 0, 1] as const; // Apple-style — menu/carousel interactions
export const EASE_GENTLE = [0.22, 1, 0.36, 1] as const; // ease-out quart — overlays, lightbox

export const DUR_FAST = 0.25;
export const DUR_BASE = 0.4;
export const DUR_SLOW = 0.7;
export const DUR_HERO = 1.5;
