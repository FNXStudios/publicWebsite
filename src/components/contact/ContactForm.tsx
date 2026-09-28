'use client';

import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from 'react';
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
  'block w-full appearance-none rounded-none border-0 border-b border-border bg-transparent px-0 py-3 text-body text-text',
  'transition-[border-color,box-shadow] duration-(--duration-micro) ease-premium',
  'placeholder:text-text-muted hover:border-border-active',
  'focus:border-focus focus:shadow-[0_1px_0_0_var(--color-focus)] focus:outline-none',
  'aria-invalid:border-danger aria-invalid:focus:shadow-[0_1px_0_0_var(--color-danger)]',
);

const noopSubscribe = () => () => {};
const readInterestParam = () => new URLSearchParams(window.location.search).get('interest') ?? '';

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
}

/** Content arrives as props so this client module never bundles configuration or full Zod. */
export function ContactForm({ interests, copy: form }: ContactFormProps) {
  const schema = useMemo(() => createContactSchema(interests.map((i) => i.value)), [interests]);
  const uid = useId();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [phase, setPhase] = useState<Phase>('idle');
  const [failure, setFailure] = useState('');
  const [attempted, setAttempted] = useState(false);
  const inFlight = useRef(false);
  const successRef = useRef<HTMLHeadingElement>(null);

  // ?interest=… (e.g. from the careers page) preselects the topic until the visitor picks one.
  const requestedParam = useSyncExternalStore(noopSubscribe, readInterestParam, () => '');
  const requestedInterest = interests.some((option) => option.value === requestedParam) ? requestedParam : '';
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
      <div className="border-t border-border-subtle pt-10" role="status">
        <h2 ref={successRef} tabIndex={-1} className="text-display-md text-text outline-none">
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
    <form noValidate onSubmit={onSubmit} aria-busy={submitting} className="grid gap-x-8 gap-y-9 sm:grid-cols-2">
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
        <div className="relative">
          <select
            id={`${uid}-interest`}
            name="interest"
            value={current.interest}
            onChange={(e) => update('interest', e.target.value)}
            aria-invalid={Boolean(errors.interest) || undefined}
            aria-describedby={errors.interest ? `${uid}-interest-error` : undefined}
            className={cn(fieldClass, 'cursor-pointer pr-8', !current.interest && 'text-text-muted')}
          >
            <option value="" disabled className="bg-surface text-text-muted">
              Choose one
            </option>
            {interests.map((option) => (
              <option key={option.value} value={option.value} className="bg-surface text-text">
                {option.label}
              </option>
            ))}
          </select>
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="pointer-events-none absolute top-1/2 right-0 size-4 -translate-y-1/2 text-text-secondary"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="m5.5 8 4.5 4.5L14.5 8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
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
          className={cn(fieldClass, 'min-h-32 resize-y')}
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
        <Button type="submit" size="lg" arrow={!submitting} disabled={submitting} className="self-start">
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
      <label htmlFor={id} className="flex items-baseline justify-between gap-2 text-small font-medium text-text-secondary">
        <span>{label}</span>
        {optional ? (
          <span className="text-[0.8125rem] font-normal text-text-muted">
            <span className="sr-only">(</span>Optional<span className="sr-only">)</span>
          </span>
        ) : null}
      </label>
      <div className="mt-1">{children}</div>
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-[0.8125rem] text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
