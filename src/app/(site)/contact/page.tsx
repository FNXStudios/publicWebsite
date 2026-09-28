import type { Metadata } from 'next';
import { contactOptions, contactPageContent } from '@/config/contact.config';
import { siteConfig } from '@/config/site.config';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo/metadata';
import { ContactForm } from '@/components/contact/ContactForm';
import { TextLink } from '@/components/ui/TextLink';
import { Eyebrow, HeadlineLines } from '@/components/ui/Typography';

export const metadata: Metadata = pageMetadata({
  title: 'Contact',
  description: contactPageContent.body,
  path: routes.contact,
});

/** The calmest page on the site: statement and direct routes left, the form right. */
export default function ContactPage() {
  const content = contactPageContent;
  return (
    <section
      aria-labelledby="contact-title"
      className="container-fnx grid gap-16 pt-[calc(var(--header-height)+4rem)] pb-(--section-space) md:grid-cols-12 md:gap-6 md:pt-[calc(var(--header-height)+7rem)]"
    >
      <div className="md:col-span-5">
        <Eyebrow className="enter-rise">{content.eyebrow}</Eyebrow>
        <h1 id="contact-title" className="enter-rise mt-6 text-display-lg text-text [--enter-step:1]">
          <HeadlineLines lines={content.headline} />
        </h1>
        <p className="enter-rise mt-8 max-w-[28rem] text-lead text-text-secondary [--enter-step:2]">{content.body}</p>

        <div className="enter-rise mt-12 border-t border-border-subtle pt-6 [--enter-step:3]">
          <h2 className="text-eyebrow uppercase text-text-muted">{content.directHeading}</h2>
          <ul className="mt-3 flex flex-col items-start">
            {siteConfig.email ? (
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-block py-2 text-body font-medium text-text underline decoration-border-active underline-offset-4 transition-colors hover:decoration-current"
                >
                  {siteConfig.email}
                </a>
              </li>
            ) : null}
            <li>
              <TextLink href={routes.careers}>Careers at FNX</TextLink>
            </li>
            <li>
              <TextLink href={routes.games}>See our games</TextLink>
            </li>
          </ul>
        </div>
      </div>

      <div className="enter-rise md:col-span-6 md:col-start-7 md:pt-3 [--enter-step:2]">
        <ContactForm interests={contactOptions.interests} copy={content.form} />
      </div>
    </section>
  );
}
