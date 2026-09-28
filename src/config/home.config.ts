import { routes } from '@/lib/routes';
import type { ArtContent, HeadlineLines, LinkContent, TitledCopy } from './content.types';

/**
 * Homepage copy. Claims here must stay defensible: no certifications, partner names,
 * client counts or figures that FNX has not verified.
 */
export const homeConfig = {
  hero: {
    eyebrow: 'Slot & instant games',
    headline: ['Independent iGaming', 'studio for real play.'],
    body: 'We design and build original slot and instant games — with the art, math and production discipline operators can rely on.',
    primaryCta: { label: 'Explore games', href: routes.games },
    secondaryCta: { label: 'Our studio', href: routes.studio },
    proofPoints: ['Original IP', 'Production ready', 'Operator focused'],
    // Interim studio artwork. Replace with final hero illustration when delivered.
    art: {
      src: '/art/hero.jpg',
      mobileSrc: '/art/hero-mobile.jpg',
      alt: '',
    },
  },

  featured: {
    eyebrow: 'Featured games',
    heading: 'Original worlds, built to play.',
    /** Maximum number of featured games shown on the homepage. */
    limit: 3,
    allGames: { label: 'All games', href: routes.games },
  },

  approach: {
    eyebrow: 'Our approach',
    headline: ['Games that', 'feel right.'],
    body: 'We start with how a game should feel in the hand — the pace of a spin, the weight of a win, the moment a feature lands — and build every decision around it.',
    capabilities: [
      {
        title: 'Game design',
        body: 'Mechanics and math developed together, and tuned until the rhythm of a session holds up.',
      },
      {
        title: 'Art & animation',
        body: 'Every title gets its own world. Symbols, motion and sound are designed as one piece.',
      },
      {
        title: 'Technology',
        body: 'Lean HTML5 builds that load quickly, adapt to any screen and integrate cleanly.',
      },
    ],
  },

  process: {
    eyebrow: 'From concept to launch',
    headline: ['Original ideas.', 'Polished execution.'],
    body: 'Each title starts as a sketch and a question: what makes this one worth playing? Symbols, interface, animation and math then develop side by side until the build matches the idea.',
    stages: ['Sketch', 'Symbols', 'Interface', 'Animation', 'Build'],
    caption: 'From first sketch to final build.',
    // Interim visual. Replace with real production material (concepts, symbol sheets, UI frames).
    art: {
      src: '/art/process.jpg',
      alt: 'A studio hall drawn as construction lines on the left, resolving into a finished, lit render on the right.',
    },
  },

  operators: {
    eyebrow: 'For operators',
    headline: ['A reliable partner', 'for real markets.'],
    body: 'We build games to ship, not just to show: predictable delivery, clean integration and builds that behave the same on every screen.',
    // TODO(business): confirm each claim before launch.
    points: [
      {
        title: 'Operator ready',
        body: 'Release-ready builds with the documentation your team needs to go live.',
      },
      {
        title: 'Flexible integration',
        body: 'Delivered to fit your platform or aggregator setup, not the other way round.',
      },
      {
        title: 'Global delivery',
        body: 'Responsive, lightweight games designed for players across markets.',
      },
    ],
    cta: { label: 'Talk to us about distribution', href: routes.contactAbout('operator-partnership') },
    art: { src: '/art/operators.jpg', alt: '' },
  },

  finalCta: {
    headline: 'Have a project in mind?',
    body: 'Tell us about your platform, your players or the game you want to make.',
    cta: { label: 'Get in touch', href: routes.contact },
  },
} satisfies {
  hero: {
    eyebrow: string;
    headline: HeadlineLines;
    body: string;
    primaryCta: LinkContent;
    secondaryCta: LinkContent;
    proofPoints: string[];
    art: ArtContent;
  };
  featured: { eyebrow: string; heading: string; limit: number; allGames: LinkContent };
  approach: { eyebrow: string; headline: HeadlineLines; body: string; capabilities: TitledCopy[] };
  process: {
    eyebrow: string;
    headline: HeadlineLines;
    body: string;
    stages: string[];
    caption: string;
    art: ArtContent;
  };
  operators: {
    eyebrow: string;
    headline: HeadlineLines;
    body: string;
    points: TitledCopy[];
    cta: LinkContent;
    art: ArtContent;
  };
  finalCta: { headline: string; body: string; cta: LinkContent };
};
