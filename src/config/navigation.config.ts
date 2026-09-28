import { routes } from '@/lib/routes';
import { parseConfig } from './schema/parse';
import { navigationSchema } from './schema/site.schema';

export const navigationConfig = parseConfig('navigation', navigationSchema, {
  primary: [
    { label: 'Games', href: routes.games },
    { label: 'Studio', href: routes.studio },
    { label: 'Careers', href: routes.careers },
  ],
  cta: { label: 'Get in touch', href: routes.contact },
  footer: [
    { label: 'Games', href: routes.games },
    { label: 'Studio', href: routes.studio },
    { label: 'Careers', href: routes.careers },
    { label: 'Contact', href: routes.contact },
  ],
});
