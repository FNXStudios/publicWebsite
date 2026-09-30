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
import { Eyebrow, Index } from '@/components/ui/Typography';
import { Reveal } from '@/motion/Reveal';

export const metadata: Metadata = pageMetadata({
  title: 'Careers',
  description: careersPageContent.paragraphs.join(' '),
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
    'group grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-1.5 border-b border-white/[0.09] py-5 transition-colors duration-[220ms] ease-premium hover:border-white/[0.16] md:grid-cols-12 md:items-center md:gap-5 md:py-6';
  const content = (
    <>
      <h3 className="text-title text-white md:col-span-4">{job.title}</h3>
      <p className="col-start-1 text-small text-text-muted md:col-span-3 md:col-start-auto">
        {JOB_TYPE_LABELS[job.type]} · {job.location}
      </p>
      <p className="col-span-2 text-body text-text-secondary transition-colors duration-[220ms] group-hover:text-text md:col-span-4 md:col-start-auto">{job.description}</p>
      <Icon className="arrow-nudge col-start-2 row-start-1 size-4 text-text-secondary group-hover:translate-x-1 group-hover:text-white md:col-span-1 md:col-start-auto md:row-start-auto md:justify-self-end" />
    </>
  );
  const contactContent = (
    <>
      <span role="heading" aria-level={3} className="text-title text-white md:col-span-4">
        {job.title}
      </span>
      <span className="col-start-1 text-small text-text-muted md:col-span-3 md:col-start-auto">
        {JOB_TYPE_LABELS[job.type]} · {job.location}
      </span>
      <span className="col-span-2 text-body text-text-secondary transition-colors duration-[220ms] group-hover:text-text md:col-span-4 md:col-start-auto">{job.description}</span>
      <Icon className="arrow-nudge col-start-2 row-start-1 size-4 text-text-secondary group-hover:translate-x-1 group-hover:text-white md:col-span-1 md:col-start-auto md:row-start-auto md:justify-self-end" />
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
 * Centered manifesto opener, compact roles list, values on a content grid.
 */
export default function CareersPage() {
  const openJobs = jobs.filter((job) => job.status === 'open').sort((a, b) => a.order - b.order);
  const { empty, values, paragraphs } = careersPageContent;

  return (
    <>
      <PageIntro
        layout="centered"
        eyebrow={careersPageContent.eyebrow}
        headline={careersPageContent.headline}
        body={paragraphs.map((paragraph, index) => (
          <p key={paragraph} className={index === 0 ? 'text-text' : undefined}>
            {paragraph}
          </p>
        ))}
        atmosphere={
          <div className="absolute inset-0 bg-[radial-gradient(36rem_24rem_at_50%_-6%,rgb(113_52_244/0.11),transparent_72%),radial-gradient(28rem_20rem_at_8%_100%,rgb(240_189_114/0.04),transparent_72%)]" />
        }
      />

      <div className="page-flow">
      <Container as="section" size="wide" aria-labelledby="roles-title">
        {openJobs.length > 0 ? (
          <>
            <h2 id="roles-title" className="text-eyebrow text-text-muted uppercase">
              {careersPageContent.listHeading}
            </h2>
            <ul className="mt-4 border-t border-white/[0.08]">
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
              <ContactTrigger size="md" placement="careers-empty" interest={empty.cta.interest}>
                {empty.cta.label}
              </ContactTrigger>
            }
          />
        )}
      </Container>

      <section aria-labelledby="careers-values-title" className="w-full">
        <Container size="wide">
          <Eyebrow rule>{values.eyebrow}</Eyebrow>
          <h2 id="careers-values-title" className="mt-4 text-display text-white">
            {values.headline}
          </h2>
          <ul className="mt-header grid gap-x-(--grid-gap) gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.items.map((item, index) => (
              <Reveal as="li" key={item.title} delay={index * 60} className="group relative border-t border-white/[0.12] pt-5">
                <span aria-hidden="true" className="absolute -top-px left-0 h-px w-8 bg-violet-400 transition-[width] duration-[560ms] ease-premium group-hover:w-full" />
                <Index n={index + 1} className="text-text-muted transition-colors duration-(--duration-interaction) group-hover:text-violet-300" />
                <h3 className="mt-4 text-title text-white">{item.title}</h3>
                <p className="mt-2.5 text-body text-text-secondary">{item.body}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>
      </div>
    </>
  );
}
