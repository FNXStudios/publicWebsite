import { z } from 'zod';
import { httpsUrlSchema } from './primitives';

/**
 * Site-entry age confirmation. This is verification UI for FNX's configured policy —
 * not identity collection and not a statement about any jurisdiction's legal age.
 */
export const ageGateSchema = z
  .object({
    enabled: z.boolean(),
    /** FNX's configured minimum age. Copy below should agree with it. */
    minimumAge: z.number().int().min(1).max(99),
    /**
     * Bump to ask every visitor again (e.g. after the policy or copy changes).
     * Stored confirmations with another version are ignored.
     */
    version: z.number().int().min(1),
    /** How long a confirmation is remembered on this device. Product configuration. */
    rememberDays: z.number().int().min(1).max(365),
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    confirmLabel: z.string().min(1),
    rejectLabel: z.string().min(1),
    /** Shown in place of the question when a visitor declines and no exitUrl is set. */
    rejected: z.object({ title: z.string().min(1), description: z.string().min(1), backLabel: z.string().min(1) }).strict(),
    responsibleGamingLabel: z.string().min(1).optional(),
    /** Optional https resource. Leave unset until FNX chooses one — never invent it. */
    responsibleGamingUrl: httpsUrlSchema.optional(),
    /** Where "No, leave site" goes. If unset, the gate stays closed with the rejected copy. */
    exitUrl: httpsUrlSchema.optional(),
  })
  .strict();

export type AgeGateConfig = z.output<typeof ageGateSchema>;
