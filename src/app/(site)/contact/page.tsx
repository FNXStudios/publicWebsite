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
  const hasDirect = Boolean(siteConfig.email || siteConfig.social.length);
  return (
    <section
      aria-labelledby="contact-title"
      className="container-fnx relative grid gap-14 pt-[calc(var(--header-height)+3rem)] pb-large md:grid-cols-12 md:gap-8 md:pt-[calc(var(--header-height)+5rem)]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute top-0 right-0 -z-10 h-[40rem] w-[60%] bg-[radial-gradient(closest-side,rgb(111_82_238/0.07),transparent)]" />
      <div className="md:col-span-5">
        <Eyebrow className="enter-rise">{content.eyebrow}</Eyebrow>
        <h1 id="contact-title" className="enter-rise mt-6 text-display-lg text-text [--enter-step:1]">
          <HeadlineLines lines={content.headline} />
        </h1>
        <p className="enter-rise mt-8 max-w-[28rem] text-lead text-text-secondary [--enter-step:2]">{content.body}</p>

        <div className="enter-rise mt-12 border-t border-border-subtle pt-6 [--enter-step:3]">
          <h2 className="text-eyebrow uppercase text-text-muted">{hasDirect ? content.directHeading : content.exploreHeading}</h2>
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
            {siteConfig.social.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-2 text-body font-medium text-text underline decoration-border-active underline-offset-4 transition-colors hover:decoration-current"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <TextLink href={routes.careers}>Careers at FNX</TextLink>
            </li>
            <li>
              <TextLink href={routes.games}>See our games</TextLink>
            </li>
          </ul>
        </div>
      </div>

      <div className="enter-rise md:col-span-7 md:col-start-6 md:pt-10 md:pl-8 lg:pl-16 [--enter-step:2]">
        <div className="rounded-[1rem] border border-white/[0.07] bg-(--bg-section) p-6 shadow-[0_40px_80px_-50px_rgb(0_0_0/0.9)] sm:p-8 lg:p-10">
          <ContactForm interests={contactOptions.interests} copy={content.form} />
        </div>
      </div>
    </section>
  );
}
