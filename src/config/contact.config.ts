import type { ContactDialogCopy } from '@/components/contact/ContactProvider';
import { contactConfigSchema } from './schema/contact.schema';
import { parseConfig } from './schema/parse';

export const contactOptions = parseConfig('contact', contactConfigSchema, {
  interests: [
    { value: 'original-content', label: 'Original content' },
    { value: 'operator-partnership', label: 'Operator partnership' },
    { value: 'studio-partnership', label: 'A new concept or studio partnership' },
    { value: 'integration', label: 'Integration' },
    { value: 'careers', label: 'Careers' },
    { value: 'other', label: 'Something else' },
  ],
});

/** Copy for the global "Get in touch" dialog (there is no /contact page). */
export const contactDialogContent = {
  eyebrow: 'Let’s talk',
  title: 'Have something worth building?',
  body: 'Original content, a new concept, a studio partner or a place on the team — tell us a little about it and we’ll take it from there.',
  note: 'Every message is read by the people who make the games. We reply to the address you give us.',
  directHeading: 'Direct',
  form: {
    submit: 'Send message',
    submitting: 'Sending…',
    success: {
      title: 'Thank you — your message is with us.',
      body: 'We read every message and will reply to the address you gave.',
      again: 'Send another message',
    },
    failure: 'We couldn’t send your message. Your details are still here — please try again in a moment.',
    unavailable: 'Our contact form is temporarily unavailable. Please try again later.',
  },
} satisfies ContactDialogCopy;
