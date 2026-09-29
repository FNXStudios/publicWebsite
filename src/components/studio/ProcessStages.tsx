'use client';

import { useEffect, useRef, useState } from 'react';

interface ProcessStagesProps {
  label: string;
  stages: { title: string; body: string }[];
}

/**
 * The production spine: numbered rows joined by one continuous vertical line, spaced
 * so the column carries real weight beside the sticky narrative.
 * The stage nearest the middle of the screen takes the violet accent (node + title);
 * every row stays fully readable. Server-rendered visible; emphasis is enhancement only.
 */
export function ProcessStages({ label, stages }: ProcessStagesProps) {
  const [active, setActive] = useState(-1);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    for (const el of refs.current) if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <ol aria-label={label} className="relative">
      {/* The spine runs from the first node to the last. */}
      <span aria-hidden="true" className="absolute top-8 bottom-8 left-4 w-px md:top-10 md:bottom-10 bg-linear-to-b from-violet-400/60 via-white/[0.12] to-white/[0.12]" />
      {stages.map((stage, index) => (
        <li
          key={stage.title}
          ref={(el) => {
            refs.current[index] = el;
          }}
          data-index={index}
          data-active={index === active || undefined}
          className="group relative grid grid-cols-[2rem_1fr] gap-x-5 py-5 md:gap-x-7 md:py-7"
        >
          <span
            aria-hidden="true"
            className="relative z-10 grid size-8 place-items-center rounded-full border border-white/[0.14] bg-(--depth-page) text-[0.75rem] font-semibold tabular-nums text-text-muted transition-[color,border-color,background-color] duration-(--duration-standard) group-hover:border-violet-border group-hover:text-violet-300 group-data-active:border-violet-border group-data-active:bg-violet-soft group-data-active:text-violet-300"
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="pt-0.5">
            <h3 className="text-title text-white/80 transition-colors duration-(--duration-standard) group-hover:text-white group-data-active:text-white">{stage.title}</h3>
            <p className="prose-measure mt-2 text-[clamp(0.9375rem,0.89rem+0.15vw,1.0625rem)] leading-[1.62] text-text-secondary">{stage.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
