import { cva, type VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { ArrowRight } from './Icons';

/**
 * The one canonical button. Tactile through material, not glow: a barely-there
 * vertical gradient, a lit top edge, a 1px violet rim and a soft coloured contact
 * shadow. Hover lifts 1px, press settles to 0.985, focus draws a 2px violet ring.
 */
export const buttonVariants = cva(
  [
    'group/button relative inline-flex shrink-0 select-none items-center justify-center gap-2.5 whitespace-nowrap',
    'font-semibold tracking-[-0.006em] rounded-md',
    'transition-[transform,background-color,border-color,color,box-shadow,filter] duration-(--duration-interaction) ease-premium',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400',
    'disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        primary: [
          'border border-[rgb(165_125_255/0.35)] bg-linear-to-b from-[#8951ff] to-violet-600 text-white',
          'shadow-[inset_0_1px_0_rgb(255_255_255/0.13),0_10px_30px_rgb(90_45_210/0.18)]',
          'hover:-translate-y-px hover:brightness-[1.04] hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.16),0_14px_36px_rgb(90_45_210/0.28)]',
          'active:translate-y-0 active:scale-[0.985] active:brightness-[0.98] active:duration-(--duration-micro)',
        ],
        secondary: [
          'border border-white/[0.13] bg-white/[0.02] text-text',
          'hover:-translate-y-px hover:border-white/25 hover:bg-white/[0.05]',
          'active:translate-y-0 active:scale-[0.985] active:bg-white/[0.07] active:duration-(--duration-micro)',
        ],
        ghost: [
          'border border-transparent text-text-secondary',
          'hover:bg-white/[0.05] hover:text-text active:scale-[0.985] active:bg-white/[0.08]',
        ],
        text: ['h-auto rounded-sm px-0 text-text hover:text-white'],
      },
      size: {
        sm: 'h-10 px-4 text-small',
        md: 'h-11 px-[1.375rem] text-[0.9375rem]',
        lg: 'h-12 px-[1.625rem] text-body',
      },
    },
    compoundVariants: [{ variant: 'text', className: 'h-auto px-0 py-2' }],
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

export function ButtonContent({ children, arrow, variant }: { children: ReactNode; arrow?: boolean; variant?: ButtonVariants['variant'] }) {
  const text = variant === 'text';
  return (
    <>
      <span className={cn(text && 'link-rule')}>{children}</span>
      {arrow ? <ArrowRight className="arrow-nudge -mr-0.5 size-[1.0625rem] group-hover/button:translate-x-1 group-focus-visible/button:translate-x-1" /> : null}
    </>
  );
}

type ButtonProps = ComponentProps<'button'> & ButtonVariants & { arrow?: boolean };

export function Button({ className, variant, size, arrow, children, type = 'button', ...props }: ButtonProps) {
  return (
    <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props}>
      <ButtonContent arrow={arrow} variant={variant}>
        {children}
      </ButtonContent>
    </button>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & ButtonVariants & { arrow?: boolean };

/** A link styled as a button — for navigation, never for actions. */
export function ButtonLink({ className, variant, size, arrow, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={cn(buttonVariants({ variant, size }), className)} {...props}>
      <ButtonContent arrow={arrow} variant={variant}>
        {children}
      </ButtonContent>
    </Link>
  );
}
