import type { ArtContent, HeadlineLines, TitledCopy } from './content.types';

export const studioConfig = {
  about: {
    eyebrow: 'STUDIO',
    headline: ['Independent by design.', 'Built around the game.'],
    body: 'FNX Studio is an independent iGaming studio founded by developers and game makers with more than five years of hands-on experience building games and production technology. We focus on original titles with a clear point of view, satisfying game feel and the discipline to ship properly.',
    art: {
      src: '/visual-fixtures/production/studio-board.png',
      alt: 'A studio wall covered in art direction studies, game symbols, concept boards and animation frames under warm production lighting.',
    },
  },

  capabilities: {
    eyebrow: 'WHAT WE DO',
    headline: ['From an idea', 'to a playable product.'],
    intro: 'FNX works across the full game-production process — from the first mechanic and mathematical model to art, animation, runtime development and delivery.',
    items: [
      {
        title: 'Original games',
        body: 'Slots and instant games built around a distinct hook, visual identity and player experience.',
        art: {
          src: '/visual-fixtures/production/concepts.png',
          alt: 'World-building studies: environment, palette and character explorations for an original title.',
        },
      },
      {
        title: 'Game production',
        body: 'Game design, math, art, animation, frontend and runtime development developed together rather than handed between isolated stages.',
        art: {
          src: '/visual-fixtures/production/stage-game.jpg',
          alt: 'A finished reel frame with production UI, win states and motion still in one screen.',
        },
      },
      {
        title: 'Operator delivery',
        body: 'Responsive builds prepared around real integration, deployment and production requirements.',
        art: {
          src: '/visual-fixtures/production/made-devices.jpg',
          alt: 'The same game presented on desktop and portrait layouts for operator environments.',
        },
      },
    ],
  },

  reason: {
    eyebrow: 'WHY FNX EXISTS',
    headline: ['More games are being made.', 'Too few feel different.'],
    intro:
      'The tools used to build games have become faster. Pipelines have become more efficient. Generative systems can produce concepts and variations in seconds.',
    blocks: [
      'That can be useful. But efficiency without taste creates sameness. When the same visual treatments, mechanics, effects and presentation patterns are repeated across dozens of titles, games stop feeling like individual worlds and start feeling like products assembled from the same kit.',
      'FNX takes the opposite approach. We use technology to remove unnecessary work, not to remove creative decisions. Every title still has people deciding why a mechanic exists, how a feature should feel, how an animation should move, how a symbol should read at game size and what makes that particular game different from the one beside it.',
    ],
    closing: 'Tools can accelerate production. They should not replace authorship.',
    art: {
      src: '/visual-fixtures/production/stage-concept.jpg',
      alt: 'A close crop of multiple visual explorations and production studies pinned to a wall in a studio environment.',
    },
  },

  philosophy: {
    eyebrow: 'OUR PHILOSOPHY',
    headline: ['A game should feel', 'considered everywhere.'],
    intro:
      'Players may never see the systems behind a game, but they feel the result of every decision: the pacing of a spin, the readability of a feature, the timing of an animation, the balance of the math and the responsiveness of the interface.',
    principles: [
      {
        label: '01 / FEEL BEFORE FEATURES',
        headline: ['The game has to feel good', 'before it has to look complicated.'],
        body: 'A long feature list can make a game sound impressive without making it enjoyable. We care more about rhythm: anticipation before a result, the weight of a reel stop, how quickly information is understood, how a win escalates and whether a feature actually changes the experience. Math, animation, audio and interface timing all contribute to that feeling.',
        art: {
          src: '/visual-fixtures/production/stage-motion.jpg',
          alt: 'Animation frame timing and energy curves for a lantern win state set into a production board.',
        },
      },
      {
        label: '02 / IDENTITY BEFORE DECORATION',
        headline: ['Every title needs', 'a point of view.'],
        body: 'Changing symbols while keeping the same structure, lighting, animation language and presentation does not create a new world. Art direction begins before asset production. Shape language, palette, typography, motion, sound and interface treatment should all come from the personality of the game. A player should be able to recognise the game before they read its name.',
        art: {
          src: '/visual-fixtures/production/symbol-sheet.png',
          alt: 'Symbol sheet and concept explorations for a fantasy game world, across multiple frames and forms.',
        },
      },
      {
        label: '03 / MECHANICS + MATH',
        headline: ['What happens and how often', 'it happens are one system.'],
        body: 'A mechanic can look exciting on paper and still feel wrong once frequency, volatility and reward structure enter the picture. We do not treat game design as one phase and mathematics as another. Feature behaviour, pacing, hit patterns and reward should reinforce the same experience the mechanic was designed around.',
        art: {
          src: '/visual-fixtures/production/stage-game.jpg',
          alt: 'A production board showing game-state logic, reel flow and mathematical behaviour with notes around the feature model.',
        },
      },
      {
        label: '04 / POLISH IS THE PRODUCT',
        headline: ['The small decisions', 'are the product.'],
        body: 'Performance, animation timing, responsive behaviour, input feedback, loading, transitions, visual hierarchy and recovery states are often described as polish. We see them as part of the experience from the beginning. A game can technically work long before it feels finished.',
        art: {
          src: '/visual-fixtures/production/made-devices.jpg',
          alt: 'A finished game presentation across devices, showing responsive UI layout and interaction states.',
        },
        compare: [
          {
            src: '/visual-fixtures/production/stage-concept.png',
            alt: 'Early lantern symbol sketches with construction lines.',
            caption: 'Sketch',
          },
          {
            src: '/visual-fixtures/production/stage-design.jpg',
            alt: 'The finished lantern symbol with palette and states.',
            caption: 'Production',
          },
        ],
      },
    ],
  },

  tools: {
    eyebrow: 'HOW WE USE TOOLS',
    headline: 'Speed is useful. Taste is still the job.',
    body: 'We use modern tools where they genuinely improve production — development tooling, automation, procedural systems and AI-assisted workflows included. But the tool does not decide what the game should be. Creative direction, gameplay, composition, animation, pacing and final quality still require judgement. If something looks generic, feels synthetic or exists only because it was quick to produce, it is not finished.',
  },

  process: {
    eyebrow: 'HOW WE WORK',
    headline: ['One team.', 'One game.'],
    body: 'Concept, math, art and engineering are not independent production lines. Each stage informs the others, and the game is repeatedly played, reviewed and refined as it develops.',
    stages: [
      { title: 'Direction', body: 'Hook, audience, core mechanic, intended game feel and visual direction set the foundation before production scales.' },
      { title: 'Game Design & Math', body: 'Mechanics, feature behaviour, pacing and the mathematical model are developed together so the reward rhythm supports the design intent.' },
      { title: 'Art Direction', body: 'World, shape language, palette, symbols, interface and motion language are established before assets are made at volume.' },
      { title: 'Build & Motion', body: 'Runtime, interaction, animation, audio behaviour and responsive presentation come together in a single development loop.' },
      { title: 'Play, Test, Refine', body: 'The actual game is reviewed for timing, clarity, feature flow, performance and device behaviour until it feels deliberate.' },
      { title: 'Production', body: 'Final build, QA, integration, delivery, handover and support all happen with a clear game-level understanding behind them.' },
    ],
  },

  work: {
    eyebrow: 'INSIDE THE WORK',
    headline: ['How a game', 'takes shape.'],
    intro: 'The finished screen is only the last layer. Before that come symbol studies, visual systems, animation tests, interface decisions, environment exploration and countless iterations that never need to be visible to the player.',
    gallery: [
      {
        label: 'World',
        caption: 'Environment, palette and the first readable silhouette.',
        src: '/visual-fixtures/production/concepts.png',
        alt: 'Colour and environment exploration pinned next to a concept sheet for a game world.',
      },
      {
        label: 'Symbol language',
        caption: 'Lantern exploration through to the final asset.',
        src: '/visual-fixtures/production/symbol-sheet.png',
        alt: 'A symbol sheet showing lantern, wild and premium symbols in different forms and states.',
      },
      {
        label: 'Interface',
        caption: 'Controls, states and interaction language.',
        src: '/visual-fixtures/production/ui-kit.jpg',
        alt: 'Game UI kit showing buttons, states, win banners and responsive controls for a slot build.',
      },
      {
        label: 'Motion',
        caption: 'Win-state timing and bounce behaviour.',
        src: '/visual-fixtures/production/animation-frames.png',
        alt: 'Animation frames for a lantern win state with frame numbers and an easing curve.',
      },
      {
        label: 'Character',
        caption: 'Idol turnaround and breakdowns.',
        src: '/visual-fixtures/production/character-sheet.png',
        alt: 'A temple idol displayed in multiple turns and angle studies, with design notes around silhouettes and expression.',
      },
      {
        label: 'Final game',
        caption: 'Finished scene, on the reels.',
        src: '/visual-fixtures/games/mystic-tides-screen-2.jpg',
        alt: 'A finished slot game screen showing the reel grid, win states and premium symbols in game context.',
      },
    ],
  },

  standard: {
    eyebrow: 'THE STANDARD',
    headline: "If it doesn't feel finished, it isn't finished.",
    body: 'A game can technically work long before it feels ready. We care about the distance between those two points — the small decisions that turn a functioning build into a coherent experience.',
    closing: 'That is the standard we want FNX to be known for.',
  },

  cta: {
    eyebrow: 'WORK WITH US',
    headline: 'Have a game in mind?',
    body: 'Talk to us about an original title, a studio partnership or bringing a new concept to production.',
    cta: { label: 'Get in touch →', interest: 'studio-partnership' },
  },
} satisfies {
  about: { eyebrow: string; headline: HeadlineLines; body: string; art: ArtContent };
  capabilities: { eyebrow: string; headline: HeadlineLines; intro: string; items: (TitledCopy & { art: ArtContent })[] };
  reason: { eyebrow: string; headline: HeadlineLines; intro: string; blocks: string[]; closing: string; art: ArtContent };
  philosophy: {
    eyebrow: string;
    headline: HeadlineLines;
    intro: string;
    principles: {
      label: string;
      headline: HeadlineLines;
      body: string;
      art: ArtContent;
      compare?: (ArtContent & { caption: string })[];
    }[];
  };
  tools: { eyebrow: string; headline: string; body: string };
  process: { eyebrow: string; headline: HeadlineLines; body: string; stages: TitledCopy[] };
  work: {
    eyebrow: string;
    headline: HeadlineLines;
    intro: string;
    gallery: { label: string; caption: string; src: string; alt: string }[];
  };
  standard: { eyebrow: string; headline: string; body: string; closing?: string };
  cta: { eyebrow: string; headline: string; body: string; cta: { label: string; interest?: string } };
};
