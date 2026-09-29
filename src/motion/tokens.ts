/**
 * Motion tokens — mirrored as CSS custom properties in src/app/globals.css.
 * One easing family, five durations. No bouncy springs in the main UI.
 */
export const ease = {
  /** Primary: fast out, long settle. */
  premium: [0.16, 1, 0.3, 1],
  standard: [0.2, 0, 0, 1],
} as const;

/** Seconds (Motion's unit). */
export const duration = {
  micro: 0.17,
  interaction: 0.26,
  standard: 0.34,
  editorial: 0.55,
  hero: 0.85,
} as const;

/** Stagger between sibling elements, in seconds. */
export const stagger = {
  tight: 0.045,
  copy: 0.07,
} as const;
