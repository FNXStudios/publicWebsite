import { routes } from '@/lib/routes';
import { parseConfig } from './schema/parse';
import { navigationSchema } from './schema/site.schema';

const destinations = [
  { label: 'Games', href: routes.games },
  { label: 'Studio', href: routes.studio },
  { label: 'Careers', href: routes.careers },
];

export const navigationConfig = parseConfig('navigation', navigationSchema, {
  primary: destinations,
  contactLabel: 'Get in touch',
  footer: destinations,
});
