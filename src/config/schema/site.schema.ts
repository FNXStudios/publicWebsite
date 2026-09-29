import { z } from 'zod';
import { hrefSchema, httpsUrlSchema, imagePathSchema } from './primitives';

export const siteSchema = z
  .object({
    name: z.string().min(1),
    /** Short descriptor used next to the name, e.g. in the default <title>. */
    descriptor: z.string().min(1),
    description: z.string().min(1).max(200),
    /** One short sentence for the footer. */
    footerLine: z.string().min(1).max(90),
    locale: z.string().regex(/^[a-z]{2}(?:_[A-Z]{2})?$/),
    defaultOgImage: imagePathSchema,
    /** Public contact address. Leave undefined until the real inbox exists. */
    email: z.email().optional(),
    social: z
      .array(z.object({ label: z.string().min(1), href: httpsUrlSchema }).strict())
      .default([]),
    /**
     * Small responsible-gaming line in the footer, e.g. "18+ · Please play responsibly.".
     * When `url` is set, `label` becomes a link. Never invent a destination: leave `url`
     * undefined until FNX has chosen its responsible-gaming resource.
     */
    responsibleGaming: z
      .object({
        ageLabel: z.string().min(1),
        label: z.string().min(1),
        url: httpsUrlSchema.optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

export const navItemSchema = z.object({ label: z.string().min(1), href: hrefSchema }).strict();

/** Top-level destinations are fixed: Games, Studio, Careers. Contact is a dialog, not a page. */
export const navigationSchema = z
  .object({
    primary: z.array(navItemSchema).min(1).max(4),
    /** Label of the global "Get in touch" action (opens the contact dialog). */
    contactLabel: z.string().min(1),
    footer: z.array(navItemSchema),
  })
  .strict();

export type SiteConfig = z.output<typeof siteSchema>;
export type NavItem = z.output<typeof navItemSchema>;
export type NavigationConfig = z.output<typeof navigationSchema>;
