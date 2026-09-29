import { describe, expect, it, vi } from 'vitest';
import { deliverContactSubmission } from '@/lib/contact/deliver';
import { fieldErrorsFrom } from '@/lib/contact/schema';
import { contactSubmissionSchema } from '@/lib/contact/server-schema';

const valid = {
  name: 'Ada',
  email: 'ada@operator.example',
  company: '',
  interest: 'game-production',
  message: 'We would like to talk about integrating your games.',
};

describe('contact schema', () => {
  it('accepts a complete enquiry', () => {
    expect(contactSubmissionSchema.safeParse(valid).success).toBe(true);
  });

  it('reports field-level messages', () => {
    const result = contactSubmissionSchema.safeParse({ ...valid, email: 'nope', interest: 'crypto', message: 'hi' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(Object.keys(fieldErrorsFrom(result.error.issues)).sort()).toEqual(['email', 'interest', 'message']);
    }
  });
});

describe('deliverContactSubmission', () => {
  it('reports not-configured instead of pretending to succeed', async () => {
    const fetchImpl = vi.fn();
    const result = await deliverContactSubmission(valid, {}, fetchImpl);
    expect(result).toEqual({ ok: false, reason: 'not-configured' });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('forwards to the configured endpoint with the bearer token', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(null, { status: 202 }));
    const result = await deliverContactSubmission(
      valid,
      { CONTACT_SUBMIT_ENDPOINT: 'https://forms.example/hook', CONTACT_SUBMIT_TOKEN: 't0k' },
      fetchImpl,
    );
    expect(result).toEqual({ ok: true });
    const [url, init] = fetchImpl.mock.calls[0]!;
    expect(url).toBe('https://forms.example/hook');
    expect(init.headers.authorization).toBe('Bearer t0k');
    expect(init.headers.accept).toBe('application/json');
    expect(JSON.parse(init.body)).toMatchObject({ email: valid.email, interest: 'game-production' });
  });

  it('treats upstream errors as failures', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(null, { status: 500 }));
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(await deliverContactSubmission(valid, { CONTACT_SUBMIT_ENDPOINT: 'https://f.example' }, fetchImpl)).toEqual({
      ok: false,
      reason: 'upstream',
    });
    spy.mockRestore();
  });
});
