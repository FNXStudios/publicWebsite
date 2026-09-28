import { z } from 'zod';
import { hrefSchema, httpsUrlSchema, imagePathSchema } from './primitives';

export const siteSchema = z
  .object({
    name: z.string().min(1),
    /** Short descriptor used next to the name, e.g. in the default <title>. */
    descriptor: z.string().min(1),
    description: z.string().min(1).max(200),
    locale: z.string().regex(/^[a-z]{2}(?:_[A-Z]{2})?$/),
    defaultOgImage: imagePathSchema,
    /** Public contact address. Leave undefined until the real inbox exists. */
    email: z.email().optional(),
    social: z
      .array(z.object({ label: z.string().min(1), href: httpsUrlSchema }).strict())
      .default([]),
    footerNotice: z.string().min(1).optional(),
  })
  .strict();

export const navItemSchema = z.object({ label: z.string().min(1), href: hrefSchema }).strict();

export const navigationSchema = z
  .object({
    primary: z.array(navItemSchema).min(1).max(5),
    cta: navItemSchema,
    footer: z.array(navItemSchema),
  })
  .strict();

export type SiteConfig = z.output<typeof siteSchema>;
export type NavItem = z.output<typeof navItemSchema>;
export type NavigationConfig = z.output<typeof navigationSchema>;
