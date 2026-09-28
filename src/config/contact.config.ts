import type { HeadlineLines } from './content.types';
import { contactConfigSchema } from './schema/contact.schema';
import { parseConfig } from './schema/parse';

export const contactOptions = parseConfig('contact', contactConfigSchema, {
  interests: [
    { value: 'operator-partnership', label: 'Operator partnership' },
    { value: 'game-development', label: 'Game development' },
    { value: 'integration', label: 'Integration' },
    { value: 'careers', label: 'Careers' },
    { value: 'other', label: 'Other' },
  ],
});

export const contactPageContent = {
  eyebrow: 'Contact',
  headline: ['Let’s build something', 'worth playing.'],
  body: 'Whether you run a platform, have a game in mind or want to join the studio — tell us a little about it and we will get back to you.',
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
} satisfies {
  eyebrow: string;
  headline: HeadlineLines;
  body: string;
  directHeading: string;
  form: {
    submit: string;
    submitting: string;
    success: { title: string; body: string; again: string };
    failure: string;
    unavailable: string;
  };
};
