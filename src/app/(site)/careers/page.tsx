import type { Metadata } from 'next';
import Link from 'next/link';
import { careersPageContent, jobs } from '@/config/careers.config';
import type { Job } from '@/config/schema/career.schema';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo/metadata';
import { ContactTrigger } from '@/components/contact/ContactTrigger';
import { PageIntro } from '@/components/layout/PageIntro';
import { ArrowRight, ArrowUpRight } from '@/components/ui/Icons';
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

export default function CareersPage() {
  const openJobs = jobs.filter((job) => job.status === 'open').sort((a, b) => a.order - b.order);
  const { empty, values } = careersPageContent;

  return (
    <>
      <PageIntro
        eyebrow={careersPageContent.eyebrow}
        headline={careersPageContent.headline}
        body={<p>{careersPageContent.body}</p>}
        atmosphere={<div className="absolute inset-0 bg-[radial-gradient(36rem_26rem_at_85%_20%,rgb(113_52_244/0.12),transparent_70%),radial-gradient(30rem_22rem_at_10%_0%,rgb(240_189_114/0.06),transparent_70%)]" />}
      />

      <section aria-labelledby="roles-title" className="container-fnx pt-medium">
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
          <div className="relative isolate overflow-hidden rounded-xl border border-white/[0.09] bg-raised px-6 py-11 sm:px-10 md:grid md:grid-cols-12 md:items-center md:gap-8 md:px-14 md:py-14">
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(34rem_22rem_at_100%_100%,rgb(113_52_244/0.18),transparent_70%)]" />
            <div aria-hidden="true" className="fnx-diagonals absolute inset-0 -z-10" />
            <div className="md:col-span-7">
              <Eyebrow rule className="text-violet-300">
                {careersPageContent.listHeading}
              </Eyebrow>
              <h2 id="roles-title" className="mt-5 text-display-sm text-white">
                {empty.headline}
              </h2>
              <p className="mt-4 max-w-[30rem] text-lead text-text-secondary">{empty.body}</p>
            </div>
            <div className="mt-8 md:col-span-4 md:col-start-9 md:mt-0 md:justify-self-end">
              <ContactTrigger size="lg" placement="careers-empty" interest={empty.cta.interest}>
                {empty.cta.label}
              </ContactTrigger>
            </div>
          </div>
        )}
      </section>

      <section aria-labelledby="careers-values-title" className="pt-large pb-large">
        <div className="container-fnx">
          <div className="grid gap-6 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <Eyebrow rule>{values.eyebrow}</Eyebrow>
              <h2 id="careers-values-title" className="mt-5 text-display text-white">
                {values.headline}
              </h2>
            </div>
          </div>
          <ul className="mt-12 grid gap-x-8 gap-y-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
            {values.items.map((item, index) => (
              <Reveal as="li" key={item.title} delay={index * 70} className="group relative border-t border-white/[0.1] pt-7 pb-6">
                <span aria-hidden="true" className="absolute -top-px left-0 h-px w-8 bg-white/30 transition-[width,background-color] duration-[560ms] ease-premium group-hover:w-full group-hover:bg-violet-400" />
                <Index n={index + 1} className="text-text-muted transition-colors duration-(--duration-interaction) group-hover:text-violet-300" />
                <h3 className="mt-5 text-[clamp(1.625rem,1.3rem+1vw,2.125rem)] leading-[1.1] font-semibold tracking-[-0.026em] text-white transition-transform duration-(--duration-interaction) ease-premium group-hover:-translate-y-0.5">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-[17rem] text-body text-text-secondary">{item.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
