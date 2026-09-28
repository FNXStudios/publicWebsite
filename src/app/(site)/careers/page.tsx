import type { Metadata } from 'next';
import Link from 'next/link';
import { careersPageContent, jobs } from '@/config/careers.config';
import type { Job } from '@/config/schema/career.schema';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo/metadata';
import { PageIntro } from '@/components/layout/PageIntro';
import { EmptyState } from '@/components/ui/EmptyState';
import { ArrowRight, ArrowUpRight } from '@/components/ui/Icons';

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
  const Icon = external ? ArrowUpRight : ArrowRight;
  const className =
    'group grid gap-3 border-b border-border-subtle py-8 transition-colors md:grid-cols-12 md:items-baseline md:gap-6';
  const content = (
    <>
      <h3 className="text-title text-text md:col-span-4">{job.title}</h3>
      <p className="text-small text-text-muted md:col-span-3">
        {JOB_TYPE_LABELS[job.type]} · {job.location}
      </p>
      <p className="text-body text-text-secondary md:col-span-4">{job.description}</p>
      <Icon className="arrow-nudge hidden size-5 justify-self-end text-text-secondary group-hover:translate-x-1 group-hover:text-text md:col-span-1 md:block" />
    </>
  );
  return (
    <li>
      {external ? (
        <a href={job.applyUrl} className={className} target="_blank" rel="noopener noreferrer">
          {content}
          <span className="sr-only">(opens in a new tab)</span>
        </a>
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
  const { empty } = careersPageContent;

  return (
    <>
      <PageIntro eyebrow={careersPageContent.eyebrow} headline={careersPageContent.headline} body={<p>{careersPageContent.body}</p>} />
      <section aria-labelledby="roles-title" className="container-fnx pt-20 pb-(--section-space) md:pt-28">
        {openJobs.length > 0 ? (
          <>
            <h2 id="roles-title" className="text-eyebrow uppercase text-text-muted">
              {careersPageContent.listHeading}
            </h2>
            <ul className="mt-6 border-t border-border-subtle">
              {openJobs.map((job) => (
                <JobRow key={job.id} job={job} />
              ))}
            </ul>
          </>
        ) : (
          <EmptyState headingId="roles-title" headline={empty.headline} body={empty.body} cta={empty.cta} />
        )}
      </section>
    </>
  );
}
