import type { ContactSubmission } from './schema';

export type DeliveryResult = { ok: true } | { ok: false; reason: 'not-configured' | 'upstream' };

/**
 * The single submission boundary. It forwards validated enquiries as JSON to
 * CONTACT_SUBMIT_ENDPOINT (Formspree, a CRM webhook or internal API), with an
 * optional bearer token. Swap the implementation here to change providers.
 *
 * No endpoint configured means nothing is delivered — the caller must report failure,
 * never a false success.
 */
export async function deliverContactSubmission(
  submission: Omit<ContactSubmission, 'website'>,
  env: Record<string, string | undefined> = process.env,
  fetchImpl: typeof fetch = fetch,
): Promise<DeliveryResult> {
  const endpoint = env.CONTACT_SUBMIT_ENDPOINT;
  if (!endpoint) return { ok: false, reason: 'not-configured' };

  try {
    // Formspree AJAX: Accept application/json so the response is JSON, not an HTML redirect.
    const response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        ...(env.CONTACT_SUBMIT_TOKEN ? { authorization: `Bearer ${env.CONTACT_SUBMIT_TOKEN}` } : {}),
      },
      body: JSON.stringify({ ...submission, source: 'fnx-studios.com/contact-dialog', submittedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(10_000),
      cache: 'no-store',
    });
    if (!response.ok) {
      console.error(`[contact] upstream responded ${response.status}`);
      return { ok: false, reason: 'upstream' };
    }
    return { ok: true };
  } catch (error) {
    console.error('[contact] delivery failed', error instanceof Error ? error.name : 'unknown');
    return { ok: false, reason: 'upstream' };
  }
}
