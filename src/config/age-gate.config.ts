import { ageGateSchema } from './schema/age-gate.schema';
import { parseConfig } from './schema/parse';
import { siteConfig } from './site.config';

/** Site-entry age gate. Copy and retention live here, not in the component. */
export const ageGateConfig = parseConfig('ageGate', ageGateSchema, {
  enabled: true,
  minimumAge: 18,
  version: 1,
  rememberDays: 30,
  eyebrow: '18+ only',
  title: 'Are you 18 or older?',
  description: 'This website contains content related to iGaming and is intended for adults only.',
  confirmLabel: 'Yes, I’m 18+',
  rejectLabel: 'No, leave site',
  rejected: {
    title: 'This site is for adults only.',
    description: 'You need to be 18 or older to view FNX Studio. You can close this tab now.',
    backLabel: 'I answered by mistake',
  },
  responsibleGamingLabel: siteConfig.responsibleGaming?.label,
  responsibleGamingUrl: siteConfig.responsibleGaming?.url,
  // TODO(business): set a confirmed exit destination (https) if FNX wants rejects redirected.
  exitUrl: undefined,
});
