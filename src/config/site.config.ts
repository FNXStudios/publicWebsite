import { parseConfig } from './schema/parse';
import { siteSchema } from './schema/site.schema';

export const siteConfig = parseConfig('site', siteSchema, {
  name: 'FNX Studio',
  descriptor: 'Independent iGaming studio',
  description:
    'FNX Studio designs and builds original slot and instant games — distinctive worlds, considered math and production-ready delivery for operators.',
  footerLine: 'Original games built with character, craft and production discipline.',
  locale: 'en_GB',
  defaultOgImage: '/og.jpg',
  email: 'hello@fnxstudio.com',
  social: [{ label: 'LinkedIn', href: 'https://www.linkedin.com/company/fnx-studio' }],
  responsibleGaming: {
    ageLabel: '18+',
    label: 'Please play responsibly.',
    // TODO(business): set the responsible-gaming resource FNX links to (https only). Unlinked until confirmed.
    url: undefined,
  },
});
