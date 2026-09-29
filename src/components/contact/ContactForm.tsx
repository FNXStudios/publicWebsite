'use client';

import * as Select from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import type { ContactInterest } from '@/config/schema/contact.schema';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/cn';
import { createContactSchema, fieldErrorsFrom, type ContactField, type ContactFieldErrors } from '@/lib/contact/schema';
import { routes } from '@/lib/routes';
import { Button } from '@/components/ui/Button';

type Values = Record<ContactField | 'website', string>;
type Phase = 'idle' | 'submitting' | 'success' | 'failure';

const EMPTY: Values = { name: '', email: '', company: '', interest: '', message: '', website: '' };

const fieldClass = cn(
  'block h-12 w-full appearance-none rounded-[0.625rem] border border-white/[0.1] bg-white/[0.02] px-4 text-body text-text',
  'shadow-[inset_0_1px_0_rgb(255_255_255/0.025)]',
  'transition-[border-color,box-shadow,background-color] duration-(--duration-micro) ease-premium',
  'placeholder:text-text-muted hover:border-white/[0.18] hover:bg-white/[0.035]',
  'focus:border-violet-500 focus:bg-white/[0.04] focus:shadow-[0_0_0_3px_rgb(130_71_255/0.22)] focus:outline-none',
  'aria-invalid:border-danger/80 aria-invalid:focus:shadow-[0_0_0_3px_rgb(255_143_143/0.2)]',
);

export interface ContactFormCopy {
  submit: string;
  submitting: string;
  success: { title: string; body: string; again: string };
  failure: string;
  unavailable: string;
}

interface ContactFormProps {
  interests: readonly ContactInterest[];
  copy: ContactFormCopy;
  /** Preselected topic (e.g. "careers" from the careers page) until the visitor picks one. */
  defaultInterest?: string;
}

/** Content arrives as props so this client module never bundles configuration or full Zod. */
export function ContactForm({ interests, copy: form, defaultInterest = '' }: ContactFormProps) {
  const schema = useMemo(() => createContactSchema(interests.map((i) => i.value)), [interests]);
  const uid = useId();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [phase, setPhase] = useState<Phase>('idle');
  const [failure, setFailure] = useState('');
  const [attempted, setAttempted] = useState(false);
  const inFlight = useRef(false);
  const successRef = useRef<HTMLHeadingElement>(null);

  const requestedInterest = interests.some((option) => option.value === defaultInterest) ? defaultInterest : '';
  const current: Values = { ...values, interest: values.interest || requestedInterest };

  useEffect(() => {
    if (phase === 'success') successRef.current?.focus();
  }, [phase]);

  const validate = (next: Values) => {
    const result = schema.safeParse(next);
    return result.success ? {} : fieldErrorsFrom(result.error.issues);
  };

  const update = (field: keyof Values, value: string) => {
    const next = { ...current, [field]: value };
    setValues(next);
    if (attempted) setErrors(validate(next));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlight.current) return;
    setAttempted(true);

    const parsed = schema.safeParse(current);
    if (!parsed.success) {
      const nextErrors = fieldErrorsFrom(parsed.error.issues);
      setErrors(nextErrors);
      const firstInvalid = Object.keys(nextErrors)[0];
      if (firstInvalid) document.getElementById(`${uid}-${firstInvalid}`)?.focus();
      return;
    }

    setErrors({});
    setFailure('');
    setPhase('submitting');
    inFlight.current = true;
    const interest = parsed.data.interest;
    track({ name: 'contact_submit_started', props: { interest } });

    try {
      const response = await fetch(routes.contactApi, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      if (response.ok) {
        track({ name: 'contact_submit_success', props: { interest } });
        setValues(EMPTY);
        setAttempted(false);
        setPhase('success');
        return;
      }
      track({ name: 'contact_submit_failed', props: { interest, status: response.status } });
      setFailure(response.status === 503 ? form.unavailable : form.failure);
      setPhase('failure');
    } catch {
      track({ name: 'contact_submit_failed', props: { interest, status: 'network' } });
      setFailure(form.failure);
      setPhase('failure');
    } finally {
      inFlight.current = false;
    }
  };

  if (phase === 'success') {
    return (
      <div className="flex min-h-[24rem] flex-col justify-center" role="status">
        <span aria-hidden="true" className="grid size-12 place-items-center rounded-full border border-violet-border bg-violet-soft text-violet-300">
          <Check className="size-5" />
        </span>
        <h2 ref={successRef} tabIndex={-1} className="mt-7 text-display-sm text-text outline-none">
          {form.success.title}
        </h2>
        <p className="mt-4 max-w-[28rem] text-lead text-text-secondary">{form.success.body}</p>
        <Button variant="secondary" className="mt-10" onClick={() => setPhase('idle')}>
          {form.success.again}
        </Button>
      </div>
    );
  }

  const submitting = phase === 'submitting';

  return (
    <form noValidate onSubmit={onSubmit} aria-busy={submitting} className="grid gap-x-4 gap-y-6 sm:grid-cols-2">
      <Field id={`${uid}-name`} label="Name" error={errors.name}>
        <input
          id={`${uid}-name`}
          name="name"
          autoComplete="name"
          value={current.name}
          onChange={(e) => update('name', e.target.value)}
          aria-invalid={Boolean(errors.name) || undefined}
          aria-describedby={errors.name ? `${uid}-name-error` : undefined}
          className={fieldClass}
        />
      </Field>

      <Field id={`${uid}-email`} label="Work email" error={errors.email}>
        <input
          id={`${uid}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={current.email}
          onChange={(e) => update('email', e.target.value)}
          aria-invalid={Boolean(errors.email) || undefined}
          aria-describedby={errors.email ? `${uid}-email-error` : undefined}
          className={fieldClass}
        />
      </Field>

      <Field id={`${uid}-company`} label="Company" optional error={errors.company}>
        <input
          id={`${uid}-company`}
          name="company"
          autoComplete="organization"
          value={current.company}
          onChange={(e) => update('company', e.target.value)}
          aria-invalid={Boolean(errors.company) || undefined}
          aria-describedby={errors.company ? `${uid}-company-error` : undefined}
          className={fieldClass}
        />
      </Field>

      <Field id={`${uid}-interest`} label="I’m interested in" error={errors.interest}>
        <Select.Root name="interest" value={current.interest || undefined} onValueChange={(value) => update('interest', value)}>
          <Select.Trigger
            id={`${uid}-interest`}
            aria-invalid={Boolean(errors.interest) || undefined}
            aria-describedby={errors.interest ? `${uid}-interest-error` : undefined}
            className={cn(fieldClass, 'group/select flex cursor-pointer items-center justify-between gap-3 text-left data-placeholder:text-text-muted data-[state=open]:border-violet-500')}
          >
            <Select.Value placeholder="Choose one" />
            <Select.Icon>
              <ChevronDown aria-hidden="true" className="size-4 text-text-secondary transition-transform duration-(--duration-interaction) group-data-[state=open]/select:rotate-180" />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content
              position="popper"
              sideOffset={6}
              className="fnx-select-content z-[95] max-h-(--radix-select-content-available-height) w-(--radix-select-trigger-width) overflow-hidden rounded-[0.75rem] border border-white/[0.1] bg-raised shadow-soft"
            >
              <Select.Viewport className="p-1.5">
                {interests.map((option) => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                    className="relative flex h-11 cursor-pointer select-none items-center rounded-[0.5rem] pr-10 pl-3.5 text-[0.9375rem] text-text-secondary outline-none transition-colors duration-(--duration-micro) data-highlighted:bg-white/[0.06] data-highlighted:text-text data-[state=checked]:text-text"
                  >
                    <Select.ItemText>{option.label}</Select.ItemText>
                    <Select.ItemIndicator className="absolute right-3.5 inline-flex">
                      <Check aria-hidden="true" className="size-4 text-violet-400" />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </Field>

      <Field id={`${uid}-message`} label="Message" error={errors.message} className="sm:col-span-2">
        <textarea
          id={`${uid}-message`}
          name="message"
          rows={5}
          value={current.message}
          onChange={(e) => update('message', e.target.value)}
          aria-invalid={Boolean(errors.message) || undefined}
          aria-describedby={errors.message ? `${uid}-message-error` : undefined}
          className={cn(fieldClass, 'h-auto min-h-36 resize-y py-3 leading-relaxed')}
        />
      </Field>

      {/* Honeypot: hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${uid}-website`}>Website</label>
        <input
          id={`${uid}-website`}
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={current.website}
          onChange={(e) => update('website', e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-5 sm:col-span-2">
        {phase === 'failure' ? (
          <p role="alert" className="border-l-2 border-danger pl-4 text-small text-text">
            {failure}
          </p>
        ) : null}
        <Button type="submit" size="lg" arrow={!submitting} disabled={submitting} className="w-full sm:w-auto sm:self-start">
          {submitting ? form.submitting : form.submit}
        </Button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  optional,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="flex items-baseline justify-between gap-2 text-[0.8125rem] font-semibold text-text-secondary">
        <span>{label}</span>
        {optional ? (
          <span className="text-[0.8125rem] font-normal normal-case tracking-normal text-text-muted">
            <span className="sr-only">(</span>Optional<span className="sr-only">)</span>
          </span>
        ) : null}
      </label>
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={`${id}-error`} className="mt-2 flex items-center gap-2 text-[0.8125rem] text-danger">
          <span aria-hidden="true" className="size-1 rounded-full bg-current" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
