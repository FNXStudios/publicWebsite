/*
 * Contact submission rules, shared verbatim by the browser form and the API route.
 * Written with zod/mini so the client bundle only carries the validators it uses;
 * this module must not import configuration (which pulls in full Zod).
 */
import * as z from 'zod/mini';

export const CONTACT_FIELDS = ['name', 'email', 'company', 'interest', 'message'] as const;
export type ContactField = (typeof CONTACT_FIELDS)[number];
export type ContactFieldErrors = Partial<Record<ContactField, string>>;

export function createContactSchema(interestValues: readonly string[]) {
  const [first, ...rest] = interestValues;
  if (first === undefined) throw new Error('createContactSchema needs at least one interest');
  return z.object({
    name: z.string().check(
      z.trim(),
      z.minLength(1, 'Please tell us your name.'),
      z.maxLength(120, 'That name is a little long.'),
    ),
    email: z.email('Please enter a valid work email.').check(z.maxLength(200, 'That email is a little long.')),
    company: z._default(
      z.optional(z.string().check(z.trim(), z.maxLength(160, 'That company name is a little long.'))),
      '',
    ),
    interest: z.enum([first, ...rest], 'Please choose what you’re interested in.'),
    message: z.string().check(
      z.trim(),
      z.minLength(10, 'Please add a few more words to your message.'),
      z.maxLength(5000, 'Please keep your message under 5,000 characters.'),
    ),
    /** Honeypot. Real people never see or fill this field. */
    website: z._default(z.optional(z.string().check(z.maxLength(200))), ''),
  });
}

export type ContactSchema = ReturnType<typeof createContactSchema>;
export type ContactSubmission = z.output<ContactSchema>;

export function fieldErrorsFrom(
  issues: readonly { path: readonly PropertyKey[]; message: string }[],
): ContactFieldErrors {
  const errors: ContactFieldErrors = {};
  for (const issue of issues) {
    const field = CONTACT_FIELDS.find((name) => name === issue.path[0]);
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}
