import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ContactForm as Form } from '@/components/contact/ContactForm';
import { contactOptions, contactPageContent } from '@/config/contact.config';

const ContactForm = () => <Form interests={contactOptions.interests} copy={contactPageContent.form} />;

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Name'), 'Ada Lovelace');
  await user.type(screen.getByLabelText('Work email'), 'ada@operator.example');
  await user.selectOptions(screen.getByLabelText('I’m interested in'), 'integration');
  await user.type(screen.getByLabelText('Message'), 'We would like to discuss an integration.');
}

afterEach(() => vi.unstubAllGlobals());

describe('ContactForm', () => {
  it('labels every field without relying on placeholders', () => {
    render(<ContactForm />);
    for (const label of ['Name', 'Work email', /^Company\s*\(Optional\)$/, 'I’m interested in', 'Message']) {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    }
  });

  it('validates before sending anything', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.click(screen.getByRole('button', { name: /send message/i }));
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByText('Please tell us your name.')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('Name')).toHaveFocus();
  });

  it('shows success only after the server confirms, and sends once', async () => {
    let resolve!: (r: Response) => void;
    const fetchMock = vi.fn(() => new Promise<Response>((r) => (resolve = r)));
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /send message/i }));
    const pending = screen.getByRole('button', { name: /sending/i });
    expect(pending).toBeDisabled();
    await user.click(pending);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/your message is with us/i)).not.toBeInTheDocument();

    resolve(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    expect(await screen.findByText(/your message is with us/i)).toBeInTheDocument();
  });

  it('keeps the message and explains the failure when delivery fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 503 })));
    const user = userEvent.setup();
    render(<ContactForm />);
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /send message/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/temporarily unavailable/i);
    expect(screen.getByLabelText('Message')).toHaveValue('We would like to discuss an integration.');
    await waitFor(() => expect(screen.getByRole('button', { name: /send message/i })).toBeEnabled());
  });
});
