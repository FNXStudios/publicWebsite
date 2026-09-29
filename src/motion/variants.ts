import type { Transition, Variants } from 'motion/react';
import { duration, ease, stagger } from './tokens';

export const transition = {
  micro: { duration: duration.micro, ease: ease.premium },
  interaction: { duration: duration.interaction, ease: ease.premium },
  standard: { duration: duration.standard, ease: ease.premium },
  editorial: { duration: duration.editorial, ease: ease.premium },
} satisfies Record<string, Transition>;

/** Crossfade for swapping visuals in place (stage art, panels). */
export const crossfade: Variants = {
  hidden: { opacity: 0, scale: 1.015 },
  visible: { opacity: 1, scale: 1, transition: transition.editorial },
  exit: { opacity: 0, transition: { duration: duration.interaction, ease: ease.standard } },
};

/** Parent that staggers its children by the copy interval. */
export const staggerChildren: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: stagger.copy } },
};

export const rise: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: transition.editorial },
};
