'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { ButtonContent, buttonVariants, type ButtonVariants } from '@/components/ui/Button';
import { TextActionContent, textActionClass } from '@/components/ui/TextLink';
import { useContact } from './ContactProvider';

interface ContactTriggerProps extends ButtonVariants {
  children: ReactNode;
  /** Preselects the topic in the form, e.g. "careers". */
  interest?: string;
  /** Where on the site the action lives, for analytics. */
  placement: string;
  arrow?: boolean;
  /** `link` renders as an editorial text action instead of a button. */
  appearance?: 'button' | 'link' | 'row';
  className?: string;
  onClick?: () => void;
}

/** Any "Get in touch" action. Opens the global contact dialog over the current page. */
export function ContactTrigger({ children, interest, placement, arrow = true, appearance = 'button', variant, size, className, onClick }: ContactTriggerProps) {
  const { open } = useContact();
  const link = appearance !== 'button';
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      className={cn(link ? textActionClass : buttonVariants({ variant, size }), className)}
      onClick={() => {
        onClick?.();
        open({ interest, placement });
      }}
    >
      {link ? (
        appearance === 'row' ? children : <TextActionContent arrow={arrow}>{children}</TextActionContent>
      ) : (
        <ButtonContent arrow={arrow} variant={variant}>
          {children}
        </ButtonContent>
      )}
    </button>
  );
}
