import { NextResponse, type NextRequest } from 'next/server';
import { deliverContactSubmission } from '@/lib/contact/deliver';
import { fieldErrorsFrom } from '@/lib/contact/schema';
import { contactSubmissionSchema } from '@/lib/contact/server-schema';

const MAX_BODY_BYTES = 16_384;

/**
 * Contact submission boundary. Validates with the same schema as the form, then
 * hands off to deliverContactSubmission(). Responses never expose upstream details.
 */
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'too_large' }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const parsed = contactSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid', fields: fieldErrorsFrom(parsed.error.issues) }, { status: 422 });
  }

  const { website, ...submission } = parsed.data;
  // Honeypot filled: accept silently, deliver nothing. Only automated clients reach this.
  if (website) return NextResponse.json({ ok: true });

  const result = await deliverContactSubmission(submission);
  if (result.ok) return NextResponse.json({ ok: true });
  if (result.reason === 'not-configured') {
    console.error('[contact] CONTACT_SUBMIT_ENDPOINT is not configured; submission not delivered');
    return NextResponse.json({ error: 'unavailable' }, { status: 503 });
  }
  return NextResponse.json({ error: 'failed' }, { status: 502 });
}
