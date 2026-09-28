import { routes } from '@/lib/routes';
import type { HeadlineLines } from './content.types';
import { jobCollectionSchema, type JobInput } from './schema/career.schema';
import { parseConfig } from './schema/parse';

/**
 * Open roles. Only list positions that are genuinely open.
 * `applyUrl` may be an internal route, an https ATS link or a mailto: address.
 */
const jobsInput: JobInput[] = [];

export const jobs = parseConfig('careers', jobCollectionSchema, jobsInput);

export const careersPageContent = {
  eyebrow: 'Careers',
  headline: ['Make games', 'with us.'],
  body: 'FNX brings art, game design, math and engineering together. We look for people who care about the small details that make a game feel right.',
  listHeading: 'Open roles',
  empty: {
    headline: 'No open roles right now.',
    body: 'We still like hearing from people who love making games. Send us a note and a link to your work.',
    cta: { label: 'Introduce yourself', href: routes.contactAbout('careers') },
  },
} satisfies {
  eyebrow: string;
  headline: HeadlineLines;
  body: string;
  listHeading: string;
  empty: { headline: string; body: string; cta: { label: string; href: string } };
};
