import type { SVGProps } from 'react';

/*
 * The handful of utility icons the site needs, drawn on one 20px grid with a
 * 1.5px stroke so they sit consistently beside Manrope. Always decorative:
 * the surrounding control carries the accessible name.
 */
type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 20 20',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
} as const;

export const ArrowRight = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M4 10h11.5M11 5.5l4.5 4.5-4.5 4.5" />
  </svg>
);

export const ArrowLeft = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M16 10H4.5M9 5.5 4.5 10 9 14.5" />
  </svg>
);

export const ArrowUpRight = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M6 14 14 6M7.5 6H14v6.5" />
  </svg>
);

export const Expand = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M3.5 7.5v-4h4M16.5 7.5v-4h-4M3.5 12.5v4h4M16.5 12.5v4h-4" />
  </svg>
);

export const Collapse = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M7.5 3.5v4h-4M12.5 3.5v4h4M7.5 16.5v-4h-4M12.5 16.5v-4h4" />
  </svg>
);

export const MenuIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M3 7h14M3 13h14" />
  </svg>
);

export const CloseIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="m5 5 10 10M15 5 5 15" />
  </svg>
);
