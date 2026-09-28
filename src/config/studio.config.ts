import type { ArtContent, HeadlineLines, TitledCopy } from './content.types';

export const studioConfig = {
  intro: {
    eyebrow: 'Studio',
    headline: ['We make games', 'we want to play.'],
    body: [
      'FNX Studio is an independent iGaming studio creating original slot and instant games.',
      'We care most about the parts players feel but rarely name: pacing, clarity, weight and polish. Getting those right takes art, math and engineering working as one discipline.',
    ],
    // Interim visual. Replace with studio photography or production material.
    art: {
      src: '/art/hero-mobile.jpg',
      alt: 'A long hall of dark columns with warm light falling across the floor toward a lit doorway.',
    },
  },

  process: {
    eyebrow: 'How we work',
    headline: ['From first sketch', 'to final build.'],
    stages: [
      { title: 'Concept', body: 'Every game starts with a premise worth building around: a world, a hook, a feeling.' },
      {
        title: 'Game design & math',
        body: 'Mechanics and math models are designed together and tested until the pacing holds up.',
      },
      {
        title: 'Art direction',
        body: 'A distinct visual identity for each title, settled before a single symbol is final.',
      },
      { title: 'Animation', body: 'Motion that gives wins weight and features clarity, without slowing play down.' },
      { title: 'Development', body: 'Lean HTML5 builds engineered for load time, stability and every screen size.' },
      { title: 'QA', body: 'Math, gameplay and device testing before anything leaves the studio.' },
      { title: 'Production', body: 'Planned releases, a clear handover and support once a game is live.' },
    ],
  },

  values: {
    eyebrow: 'What we care about',
    items: [
      { title: 'Game feel', body: 'Timing, feedback and flow — the difference between a spin and a good spin.' },
      { title: 'Visual identity', body: 'Worlds that are recognisable at thumbnail size and rewarding at full screen.' },
      { title: 'Math & mechanics', body: 'Models that are honest, readable and fun to learn over a session.' },
      { title: 'Performance', body: 'Fast first load and steady frame rates on the phones players actually own.' },
      { title: 'Player experience', body: 'Clear interfaces, sensible defaults and nothing that gets in the way.' },
    ],
  },

  capabilities: {
    eyebrow: 'Production capabilities',
    headline: 'Built on solid ground.',
    body: 'Technology is how the craft reaches players. It should be invisible when it works — so we make sure it does.',
    // TODO(business): confirm each capability reflects the current pipeline before launch.
    items: [
      { title: 'Responsive HTML5', body: 'One build that adapts to desktop, tablet and mobile in either orientation.' },
      {
        title: 'Production-ready runtime',
        body: 'A shared game runtime refined across titles, so each release starts from proven ground.',
      },
      {
        title: 'Operator integrations',
        body: 'Games packaged to integrate with operator and aggregator platforms.',
      },
      {
        title: 'Performance-focused delivery',
        body: 'Asset budgets, compressed textures and load profiling on every build.',
      },
      {
        title: 'Config-driven games',
        body: 'Math, features and presentation configured rather than hard-coded, so variants ship faster.',
      },
    ],
  },
} satisfies {
  intro: { eyebrow: string; headline: HeadlineLines; body: string[]; art: ArtContent };
  process: { eyebrow: string; headline: HeadlineLines; stages: TitledCopy[] };
  values: { eyebrow: string; items: TitledCopy[] };
  capabilities: { eyebrow: string; headline: string; body: string; items: TitledCopy[] };
};
