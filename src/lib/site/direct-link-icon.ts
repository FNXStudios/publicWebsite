import type { ComponentType, SVGProps } from 'react';
import { LinkedInIcon, MailIcon } from '@/components/ui/Icons';

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

/** Pick a brand/utility glyph for a public contact or social href. */
export function iconForDirectLink(href: string): Icon | null {
  if (href.startsWith('mailto:')) return MailIcon;
  try {
    const host = new URL(href).hostname.replace(/^www\./, '');
    if (host === 'linkedin.com' || host.endsWith('.linkedin.com')) return LinkedInIcon;
  } catch {
    return null;
  }
  return null;
}
