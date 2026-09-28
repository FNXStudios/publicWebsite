import { z } from 'zod';
import { slugSchema } from './primitives';

export const contactInterestSchema = z.object({ value: slugSchema, label: z.string().min(1) }).strict();

export const contactConfigSchema = z
  .object({
    interests: z
      .array(contactInterestSchema)
      .min(1)
      .refine((items) => new Set(items.map((i) => i.value)).size === items.length, 'interest values must be unique'),
  })
  .strict();

export type ContactInterest = z.output<typeof contactInterestSchema>;
