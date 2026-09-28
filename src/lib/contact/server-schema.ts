import { contactOptions } from '@/config/contact.config';
import { createContactSchema } from './schema';

/** The contact schema bound to the configured interests (server side). */
export const contactSubmissionSchema = createContactSchema(contactOptions.interests.map((i) => i.value));
