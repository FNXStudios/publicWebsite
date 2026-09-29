import type { ArtContent, HeadlineLines, TitledCopy } from './content.types';

/**
 * Studio page copy, in reading order. Studio is the About page, told in eight chapters:
 * who FNX is → why it exists → what it builds → how it thinks → how the team works →
 * inside the work → the standard → contact.
 * The opener is typographic (no image); production evidence arrives later.
 */
export const studioConfig = {
  about: {
    eyebrow: 'About',
    headline: ['Independent by design.', 'Built around the game.'],
    /** One-sentence summary for metadata and sharing. */
    summary: 'FNX Studio is an independent iGaming studio founded by developers and game makers with more than five years of hands-on experience building games.',
    paragraphs: [
      'FNX Studio is an independent iGaming studio founded by developers and game makers with more than five years of hands-on experience building games, game systems and production technology.',
      'We have worked across the parts players see and the systems they never do — gameplay, math, art, animation, frontend, runtime and delivery. That experience taught us how easily a strong idea can lose its identity when those parts are treated separately.',
      'FNX exists to build games differently: with a clear creative point of view, mechanics and math developed together, and enough attention to detail that the finished experience feels authored rather than assembled.',
    ],
    proof: ['5+ years building games', 'Original IP', 'Independent studio'],
  },

  reason: {
    headline: ['More games are being made.', 'Too few feel different.'],
    intro: 'Faster tools and pipelines can produce concepts and variations in seconds. Efficiency without taste creates sameness — games that feel assembled from the same kit.',
    statement: 'Tools can accelerate production. They should not replace authorship.',
    closing: 'People still decide why a mechanic exists and how it should feel. Speed matters. Taste still decides whether something is finished.',
  },

  capabilities: {
    eyebrow: 'What we build',
    headline: 'From an idea to a playable product.',
    intro: 'One team across the whole production — from the first mechanic and math model to art, motion, runtime and delivery.',
    items: [
      {
        title: 'Original games',
        body: 'Slots and instant games built around a distinct hook, visual identity and player experience.',
      },
      {
        title: 'Game production',
        body: 'Design, math, art, animation and runtime developed together — not handed between isolated stages.',
      },
      {
        title: 'Operator delivery',
        body: 'Responsive builds prepared around real integration, deployment and production requirements.',
      },
    ],
  },

  thinking: {
    eyebrow: 'How we think',
    headline: ['A game should feel', 'considered everywhere.'],
    intro: 'Players never see the systems behind a game. They feel the result of every decision.',
    principles: [
      {
        label: 'Feel',
        title: 'Feel comes before complexity.',
        body: 'A game has to feel good before it has to look complicated. We design for rhythm over feature lists — the anticipation before a stop, the weight of a reel landing, the way a win escalates — and tune it until a session has a pulse.',
        art: {
          src: '/visual-fixtures/production/made-feel.jpg',
          alt: 'Reels mid-spin: three lanterns have landed on a glowing win line while the last two reels still blur.',
        },
      },
      {
        label: 'Point of view',
        title: 'Every world needs a reason.',
        body: 'Every title should have a reason to look and behave the way it does. Shape, palette, motion and sound come from the game’s personality, so a world is recognisable before you read its name — never assembled from a shared kit.',
        art: {
          src: '/art/studio.webp',
          alt: 'Key art for three original game worlds pinned above a symbol set, palette swatches and timing notes.',
        },
      },
      {
        label: 'System',
        title: 'Mechanics and math are one design.',
        body: 'What happens and how often it happens are part of the same decision. Mechanics and the math model are built together, so pacing and reward support the feeling the mechanic was made for instead of fighting it.',
        art: {
          src: '/art/process.webp',
          alt: 'A concept board with symbol sketches, an in-game reel layout, a palette and animation timing curves.',
        },
      },
      {
        label: 'Detail',
        title: 'The small decisions are the product.',
        body: 'Timing, readability, states and feedback aren’t polish added at the end. They are the game — and they are where players decide, usually without knowing it, whether something feels finished.',
        art: {
          src: '/visual-fixtures/production/stage-design.jpg',
          alt: 'The finished lantern symbol with its palette and idle, win and dim states.',
        },
      },
    ],
  },

  process: {
    headline: ['One team.', 'One game.'],
    body: 'Concept, math, art and engineering aren’t separate production lines. The same people carry a game from its first question to its final build — played, reviewed and refined the whole way through.',
    art: {
      src: '/art/studio-layers.webp',
      alt: 'The layers of a slot game — background, reel frame, symbols and interface — stacked into one build.',
    },
    stages: [
      {
        title: 'Direction',
        body: 'Hook, audience, core mechanic and intended feel, set before production scales.',
      },
      {
        title: 'Game Design & Math',
        body: 'Mechanics, features and the math model shaped together around one reward rhythm.',
      },
      {
        title: 'Art Direction',
        body: 'World, shape language, palette and motion language defined before assets are made at volume.',
      },
      {
        title: 'Build & Motion',
        body: 'Runtime, interaction, animation and audio come together in one development loop.',
      },
      {
        title: 'Play, Test, Refine',
        body: 'The real game is reviewed for timing, clarity, performance and device behaviour.',
      },
      {
        title: 'Production',
        body: 'Final build, QA, integration, delivery and support — with the whole game understood.',
      },
    ],
  },

  work: {
    eyebrow: 'Inside the work',
    headline: ['How a game', 'takes shape.'],
    intro: 'The finished screen is only the last layer. Before it come studies, systems and tests the player never needs to see.',
    gallery: [
      {
        label: 'Symbol development',
        caption: 'One symbol language per world, readable at lobby size.',
        src: '/visual-fixtures/production/symbol-sheet.jpg',
        alt: 'Symbol sheets for three games: wilds, premium symbols and card royals in each world’s style.',
      },
      {
        label: 'Art direction',
        caption: 'Environment, palette and the first readable silhouette.',
        src: '/visual-fixtures/production/concepts.jpg',
        alt: 'Six pencil and sepia environment studies for a game world, pinned in two rows.',
      },
      {
        label: 'Motion + UI',
        caption: 'Controls, states and win timing.',
        src: '/visual-fixtures/production/ui-kit.jpg',
        alt: 'A game UI kit showing spin buttons, bet controls and win banners in three colourways and four states.',
      },
      {
        label: 'Final build',
        caption: 'Every layer, resolved on the reels.',
        src: '/visual-fixtures/games/mystic-tides-screen-2.jpg',
        alt: 'A finished slot game screen showing the reel grid, win states and premium symbols in game context.',
      },
    ],
  },

  standard: {
    eyebrow: 'The standard',
    headline: ['If it doesn’t feel finished,', 'it isn’t finished.'],
    body: 'From the first sketch to the final build, the work continues until the whole game feels resolved.',
  },

  cta: {
    headline: 'Have a game in mind?',
    body: 'Talk to us about an original title, a studio partnership or bringing a new concept to production.',
    cta: { label: 'Get in touch', interest: 'studio-partnership' },
  },
} satisfies {
  about: {
    eyebrow: string;
    headline: HeadlineLines;
    summary: string;
    paragraphs: string[];
    proof: string[];
  };
  reason: { headline: HeadlineLines; intro: string; statement: string; closing: string };
  capabilities: {
    eyebrow: string;
    headline: string;
    intro: string;
    items: TitledCopy[];
  };
  thinking: {
    eyebrow: string;
    headline: HeadlineLines;
    intro: string;
    principles: (TitledCopy & { label: string; art: ArtContent })[];
  };
  process: {
    headline: HeadlineLines;
    body: string;
    art: ArtContent;
    stages: TitledCopy[];
  };
  work: {
    eyebrow: string;
    headline: HeadlineLines;
    intro: string;
    gallery: { label: string; caption: string; src: string; alt: string }[];
  };
  standard: { eyebrow: string; headline: HeadlineLines; body: string };
  cta: {
    headline: string;
    body: string;
    cta: { label: string; interest?: string };
  };
};
