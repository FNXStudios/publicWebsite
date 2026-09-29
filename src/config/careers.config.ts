import type { ArtContent, ContactAction, HeadlineLines, TitledCopy } from './content.types';
import { jobCollectionSchema, type JobInput } from './schema/career.schema';
import { parseConfig } from './schema/parse';

/**
 * Open roles. Only list positions that are genuinely open.
 * `applyUrl` may be an internal route, an https ATS link or a mailto: address.
 */
const jobsInput: JobInput[] = [
  {
    id: 'animator',
    title: 'Animator',
    type: 'full-time',
    location: 'Remote',
    description: 'Create polished 2D animations for characters, symbols and game moments, working closely with art and game design.',
    status: 'open',
    applyUrl: '/careers',
    order: 1,
  },
];

export const jobs = parseConfig('careers', jobCollectionSchema, jobsInput);

export const careersPageContent = {
  eyebrow: 'Careers',
  headline: ['Make games', 'with us.'],
  body: 'FNX brings art, game design, math, motion and engineering together. We look for people who care about the small details that make a game feel right.',
  listHeading: 'Open roles',
  // Interim production visuals (scripts/visual-fixtures). Replace with real studio work.
  gallery: [
    { label: 'Character sheet', src: '/visual-fixtures/production/character-sheet.png', alt: 'A golden idol mask drawn in turnaround with three expressions.' },
    { label: 'Animation frames', src: '/visual-fixtures/production/animation-frames.png', alt: 'Eight frames of a lantern symbol swinging into place.' },
    { label: 'Symbol evolution', src: '/visual-fixtures/production/stage-concept.png', alt: 'A pencil sketch of a lantern symbol with notes and thumbnail variants.' },
    { label: 'UI iteration', src: '/visual-fixtures/production/ui-kit.jpg', alt: 'Spin button states and controls for three game themes.' },
  ],
  values: {
    eyebrow: 'What we care about',
    headline: 'Small details, taken seriously.',
    items: [
      { title: 'Craft', body: 'Details are the work, not the finishing touch.' },
      { title: 'Ownership', body: 'See the game through, not just your part of it.' },
      { title: 'Clarity', body: 'Say what you mean and make it easy to follow.' },
      { title: 'Iteration', body: 'Make it, play it, make it better.' },
    ],
  },
  empty: {
    headline: 'Nothing open right now.',
    body: 'We still like hearing from people who care deeply about making games.',
    cta: { label: 'Introduce yourself', interest: 'careers' },
  },
} satisfies {
  eyebrow: string;
  headline: HeadlineLines;
  body: string;
  listHeading: string;
  gallery: (ArtContent & { label: string })[];
  values: { eyebrow: string; headline: string; items: TitledCopy[] };
  empty: { headline: string; body: string; cta: ContactAction };
};
