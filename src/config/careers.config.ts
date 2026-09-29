import type { ContactAction, HeadlineLines, TitledCopy } from './content.types';
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
  {
    id: '2d-game-artist',
    title: '2D Game Artist',
    type: 'full-time',
    location: 'Remote',
    description: 'Design symbols, characters and world art that read clearly at small sizes and carry a strong identity across the game.',
    status: 'open',
    applyUrl: '/careers',
    order: 2,
  },
];

export const jobs = parseConfig('careers', jobCollectionSchema, jobsInput);

export const careersPageContent = {
  eyebrow: 'Careers',
  headline: ["Let's make great games together"],
  paragraphs: [
    'We are a small company with big dreams. We look to each other to inspire creativity and spark innovation. We understand that dreaming big is what pushes us to think differently and be better.',
    'Join us on our mission to develop the next generation of innovative casino games.',
  ],
  listHeading: 'Open roles',
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
  paragraphs: readonly [string, ...string[]];
  listHeading: string;
  values: { eyebrow: string; headline: string; items: TitledCopy[] };
  empty: { headline: string; body: string; cta: ContactAction };
};
