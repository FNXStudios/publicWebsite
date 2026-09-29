import { routes } from '@/lib/routes';
import type { ArtContent, ContactAction, HeadlineLines, LinkContent } from './content.types';

/**
 * Homepage copy. Claims must stay defensible: no certifications, partner names,
 * client counts or figures FNX has not verified.
 *
 * Artwork under /visual-fixtures/ and /art/ is interim, generated development art
 * (scripts/visual-fixtures). Swap paths here when final production material arrives.
 */
export const homeConfig = {
  hero: {
    eyebrow: 'Original games · Real experiences.',
    headline: ['Independent iGaming', 'studio for real play.'],
    body: 'We make original slot and instant games — worlds with character, tuned to feel right and built to run anywhere.',
    primaryCta: { label: 'Explore Games', href: routes.games },
    secondaryCta: { label: 'Meet the Studio', href: routes.studio },
    proofPoints: ['Original IP', 'Production Ready', 'Operator Focused'],
    art: { src: '/art/hero.png', mobileSrc: '/art/hero-mobile.png', alt: '' },
  },

  featured: {
    eyebrow: 'Featured games',
    headline: ['Original worlds.', 'Built to play.'],
    /** Maximum number of featured games shown on the homepage. */
    limit: 3,
    allGames: { label: 'View all games', href: routes.games },
  },

  madeToHit: {
    eyebrow: 'Built different',
    headline: ['Made to hit.'],
    body: 'We care about the moments players actually feel — the rhythm of a spin, the clarity of a feature and the payoff when everything lands.',
    panels: [
      {
        label: 'Game feel',
        title: 'Every spin needs rhythm. Every win needs weight.',
        body: 'Anticipation, landing and payoff are timed frame by frame, then tuned against the math until a session has a pulse.',
        art: {
          src: '/visual-fixtures/production/made-feel.png',
          alt: 'Reels mid-spin: three lanterns have landed on a glowing win line while the last two reels still blur.',
        },
      },
      {
        label: 'Visual impact',
        title: 'Distinct worlds made to be recognised at a glance.',
        body: 'Every title gets its own symbols, characters and light — readable at thumbnail size and rewarding at full screen.',
        art: {
          src: '/visual-fixtures/production/made-impact.png',
          alt: 'A lineup of hero symbols from three worlds: a red lantern and dragon pearl, a violet jellyfish and crystal, a golden idol and emerald.',
        },
      },
      {
        label: 'Production ready',
        title: 'Fast, responsive games built for real devices and real operators.',
        body: 'One build that holds its frame rate and its layout on desktop, tablet and the phones players actually own.',
        art: {
          src: '/visual-fixtures/production/made-devices.png',
          alt: 'The same games running on a desktop monitor, a tablet and a phone.',
        },
      },
    ],
  },

  ideaToGame: {
    eyebrow: 'From idea to game',
    headline: ['One idea.', 'Built all the way through.'],
    body: 'Game design, art, motion and engineering evolve together until the finished game feels like one coherent experience.',
    subject: 'Following one symbol — a lantern — from first sketch to the reels.',
    stages: [
      {
        title: 'Concept',
        body: 'A pencil idea and a question: will it read at 64 pixels, and does it belong in this world?',
        art: { src: '/visual-fixtures/production/stage-concept.png', alt: 'A pencil sketch of a lantern symbol with construction lines, thumbnail variants and notes.' },
      },
      {
        title: 'Design',
        body: 'Final form, palette and states — idle, win and dim — settled together so the symbol works on every reel.',
        art: { src: '/visual-fixtures/production/stage-design.png', alt: 'The finished lantern symbol with its palette swatches and idle, win and dim states.' },
      },
      {
        title: 'Motion',
        body: 'A landing swing, a flash of light and a curve tuned to 320 ms — motion that gives the win weight without slowing play.',
        art: { src: '/visual-fixtures/production/stage-motion.png', alt: 'Onion-skinned animation frames of the lantern swinging, above an easing curve editor.' },
      },
      {
        title: 'Game',
        body: 'On the reels, on the line, in the player’s hands — the same idea, now part of a game.',
        art: { src: '/visual-fixtures/production/stage-game.png', alt: 'Three lanterns and a wild landing on a lit win line in the finished game.' },
      },
    ],
  },

  operators: {
    eyebrow: 'For operators',
    headline: ['Creative games.', 'Serious delivery.'],
    body: 'Original content is only useful if it ships cleanly. We build games to go live — and to behave the same everywhere they do.',
    // TODO(business): confirm each capability reflects the current pipeline before launch.
    capabilities: [
      { label: 'Responsive', body: 'Built for desktop and mobile.' },
      { label: 'Performance', body: 'Fast loading and stable runtime.' },
      { label: 'Integration', body: 'Made for operator and aggregator workflows.' },
      { label: 'Delivery', body: 'A clear path from build to production.' },
    ],
    cta: { label: 'Talk to us about distribution', interest: 'operator-partnership' },
  },

  finalCta: {
    eyebrow: 'Let’s build something',
    headline: 'Have a game in mind?',
    body: 'Whether you’re looking for original content, a new concept or a studio partner, we’d like to hear about it.',
    cta: { label: 'Get in touch' },
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
  featured: { eyebrow: string; headline: HeadlineLines; limit: number; allGames: LinkContent };
  madeToHit: {
    eyebrow: string;
    headline: HeadlineLines;
    body: string;
    panels: { label: string; title: string; body: string; art: ArtContent }[];
  };
  ideaToGame: {
    eyebrow: string;
    headline: HeadlineLines;
    body: string;
    subject: string;
    stages: { title: string; body: string; art: ArtContent }[];
  };
  operators: {
    eyebrow: string;
    headline: HeadlineLines;
    body: string;
    capabilities: { label: string; body: string }[];
    cta: ContactAction;
  };
  finalCta: { eyebrow: string; headline: string; body: string; cta: ContactAction };
};
