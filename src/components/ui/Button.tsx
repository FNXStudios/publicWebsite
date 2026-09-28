import { cva, type VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { ArrowRight } from './Icons';

export const buttonVariants = cva(
  [
    'group/button relative inline-flex shrink-0 select-none items-center justify-center gap-3 whitespace-nowrap',
    'font-semibold tracking-[-0.005em] rounded-md',
    'transition-[transform,background-color,border-color,color,box-shadow] duration-(--duration-micro) ease-premium',
    'active:scale-[0.985] disabled:pointer-events-none disabled:opacity-55',
    'focus-visible:outline-offset-4',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-accent text-white',
          'shadow-[inset_0_1px_0_rgb(255_255_255/0.2),inset_0_-1px_0_rgb(0_0_0/0.18),0_1px_2px_rgb(0_0_0/0.4)]',
          'hover:-translate-y-px hover:bg-accent-hover',
        ],
        secondary: [
          'border border-border bg-white/[0.02] text-text',
          'hover:-translate-y-px hover:border-border-active hover:bg-white/[0.05]',
        ],
      },
      size: {
        sm: 'h-10 px-4 text-small',
        md: 'h-12 px-5 text-[0.9375rem]',
        lg: 'h-14 px-7 text-body',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

type Variants = VariantProps<typeof buttonVariants>;

function Content({ children, arrow }: { children: ReactNode; arrow?: boolean }) {
  return (
    <>
      <span>{children}</span>
      {arrow ? (
        <ArrowRight className="arrow-nudge -mr-1 size-[1.125rem] group-hover/button:translate-x-1" />
      ) : null}
    </>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & Variants & { arrow?: boolean };

export function Button({ className, variant, size, arrow, children, type = 'button', ...props }: ButtonProps) {
  return (
    <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props}>
      <Content arrow={arrow}>{children}</Content>
    </button>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & Variants & { arrow?: boolean };

/** A link styled as a button — for navigation, never for actions. */
export function ButtonLink({ className, variant, size, arrow, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={cn(buttonVariants({ variant, size }), className)} {...props}>
      <Content arrow={arrow}>{children}</Content>
    </Link>
  );
}
