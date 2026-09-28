import { z } from 'zod';
import { hrefSchema, slugSchema } from './primitives';

export const JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship'] as const;

export const jobSchema = z
  .object({
    id: slugSchema,
    title: z.string().trim().min(1).max(80),
    type: z.enum(JOB_TYPES),
    location: z.string().trim().min(1).max(80),
    description: z.string().trim().min(1).max(280),
    status: z.enum(['open', 'closed']),
    applyUrl: hrefSchema,
    order: z.number().int().min(0),
  })
  .strict();

export const jobCollectionSchema = z.array(jobSchema).superRefine((jobs, ctx) => {
  const seen = new Set<string>();
  jobs.forEach((job, index) => {
    if (seen.has(job.id)) ctx.addIssue({ code: 'custom', path: [index, 'id'], message: `duplicate job id "${job.id}"` });
    seen.add(job.id);
  });
});

export type JobInput = z.input<typeof jobSchema>;
export type Job = z.output<typeof jobSchema>;
export type JobType = (typeof JOB_TYPES)[number];
