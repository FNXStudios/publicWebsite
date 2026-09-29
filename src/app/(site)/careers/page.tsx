import type { Metadata } from 'next';
import Link from 'next/link';
import { careersPageContent, jobs } from '@/config/careers.config';
import type { Job } from '@/config/schema/career.schema';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo/metadata';
import { ContactTrigger } from '@/components/contact/ContactTrigger';
import { Container } from '@/components/layout/Container';
import { PageIntro } from '@/components/layout/PageIntro';
import { EmptyState } from '@/components/ui/EmptyState';
import { ArrowRight, ArrowUpRight } from '@/components/ui/Icons';
import { ResponsiveArt } from '@/components/ui/ResponsiveArt';
import { Eyebrow, Index } from '@/components/ui/Typography';
import { Reveal } from '@/motion/Reveal';

export const metadata: Metadata = pageMetadata({
  title: 'Careers',
  description: careersPageContent.body,
  path: routes.careers,
});

const JOB_TYPE_LABELS: Record<Job['type'], string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
};

function JobRow({ job }: { job: Job }) {
  const external = !job.applyUrl.startsWith('/');
  const opensCareersContact = job.applyUrl === routes.careers;
  const Icon = external ? ArrowUpRight : ArrowRight;
  const className =
    'group grid gap-3 border-b border-white/[0.09] py-8 transition-[colors,transform] duration-[220ms] ease-premium hover:border-white/[0.16] md:grid-cols-12 md:items-baseline md:gap-6 md:hover:translate-x-0.5';
  const content = (
    <>
      <h3 className="text-title text-white md:col-span-4">{job.title}</h3>
      <p className="text-small text-text-muted md:col-span-3">
        {JOB_TYPE_LABELS[job.type]} · {job.location}
      </p>
      <p className="text-body text-text-secondary transition-colors duration-[220ms] group-hover:text-text md:col-span-4">{job.description}</p>
      <Icon className="arrow-nudge hidden size-5 justify-self-end text-text-secondary group-hover:translate-x-1 group-hover:text-white md:col-span-1 md:block" />
    </>
  );
  const contactContent = (
    <>
      <span role="heading" aria-level={3} className="text-title text-white md:col-span-4">{job.title}</span>
      <span className="text-small text-text-muted md:col-span-3">
        {JOB_TYPE_LABELS[job.type]} · {job.location}
      </span>
      <span className="text-body text-text-secondary transition-colors duration-[220ms] group-hover:text-text md:col-span-4">{job.description}</span>
      <Icon className="arrow-nudge hidden size-5 justify-self-end text-text-secondary group-hover:translate-x-1 group-hover:text-white md:col-span-1 md:block" />
    </>
  );
  return (
    <li>
      {external ? (
        <a href={job.applyUrl} className={className} target="_blank" rel="noopener noreferrer">
          {content}
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      ) : opensCareersContact ? (
        <ContactTrigger appearance="row" placement={`careers-role-${job.id}`} interest="careers" className={`${className} w-full text-left`}>
          {contactContent}
        </ContactTrigger>
      ) : (
        <Link href={job.applyUrl} className={className}>
          {content}
        </Link>
      )}
    </li>
  );
}

/**
 * Editorial split opener (headline ~7 columns ↔ copy), then real production work at the
 * wide width, the roles (or a compact "nothing open" line), and the values on a wide
 * four-column editorial grid. No floating cards.
 */
export default function CareersPage() {
  const openJobs = jobs.filter((job) => job.status === 'open').sort((a, b) => a.order - b.order);
  const { empty, values, art } = careersPageContent;

  return (
    <>
      <PageIntro
        layout="split"
        eyebrow={careersPageContent.eyebrow}
        headline={careersPageContent.headline}
        body={<p>{careersPageContent.body}</p>}
        atmosphere={<div className="absolute inset-0 bg-[radial-gradient(40rem_28rem_at_85%_10%,rgb(113_52_244/0.12),transparent_70%),radial-gradient(30rem_22rem_at_10%_0%,rgb(240_189_114/0.05),transparent_70%)]" />}
      >
        <figure className="enter-settle relative mt-14 aspect-[4/3] overflow-hidden rounded-xl bg-raised sm:aspect-[16/8] md:mt-20 md:aspect-[21/9]">
          <ResponsiveArt src={art.src} alt={art.alt} priority quality={80} sizes="(max-width: 1600px) 100vw, 1480px" imgClassName="object-[62%_50%]" />
        </figure>
      </PageIntro>

      <Container as="section" size="wide" aria-labelledby="roles-title" className="pt-sec-md">
        {openJobs.length > 0 ? (
          <>
            <h2 id="roles-title" className="text-eyebrow text-text-muted uppercase">
              {careersPageContent.listHeading}
            </h2>
            <ul className="mt-6 border-t border-white/[0.08]">
              {openJobs.map((job) => (
                <JobRow key={job.id} job={job} />
              ))}
            </ul>
          </>
        ) : (
          <EmptyState
            headingId="roles-title"
            eyebrow={careersPageContent.listHeading}
            headline={empty.headline}
            body={empty.body}
            action={
              <ContactTrigger size="lg" placement="careers-empty" interest={empty.cta.interest}>
                {empty.cta.label}
              </ContactTrigger>
            }
          />
        )}
      </Container>

      <section aria-labelledby="careers-values-title" className="w-full pt-sec-lg pb-sec-md">
        <Container size="wide">
          <Eyebrow rule>{values.eyebrow}</Eyebrow>
          <h2 id="careers-values-title" className="mt-5 text-display text-white">
            {values.headline}
          </h2>
          <ul className="mt-14 grid gap-x-(--grid-gap) gap-y-10 sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
            {values.items.map((item, index) => (
              <Reveal as="li" key={item.title} delay={index * 70} className="group relative border-t border-white/[0.12] pt-7">
                <span aria-hidden="true" className="absolute -top-px left-0 h-px w-8 bg-violet-400 transition-[width] duration-[560ms] ease-premium group-hover:w-full" />
                <Index n={index + 1} className="text-text-muted transition-colors duration-(--duration-interaction) group-hover:text-violet-300" />
                <h3 className="mt-5 text-heading text-white">{item.title}</h3>
                <p className="mt-3 max-w-[20rem] text-body text-text-secondary">{item.body}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
