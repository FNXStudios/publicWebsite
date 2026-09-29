import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AgeGateDialog, type AgeGateCopy } from '@/components/age-gate/AgeGateDialog';
import { AGE_GATE_STORAGE_KEY, createVerification } from '@/lib/age-gate/storage';

const copy: AgeGateCopy = {
  eyebrow: '18+ only',
  title: 'Are you 18 or older?',
  description: 'Adults only.',
  confirmLabel: 'Yes, I’m 18+',
  rejectLabel: 'No, leave site',
  rejected: { title: 'This site is for adults only.', description: 'Close this tab.', backLabel: 'I answered by mistake' },
  responsibleGamingLabel: 'Please play responsibly.',
};

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  document.documentElement.removeAttribute('data-age-gate');
});

afterEach(() => vi.useRealTimers());

async function renderGate(version = 1) {
  const result = render(<AgeGateDialog copy={copy} version={version} rememberDays={30} />);
  await act(async () => {
    await new Promise((r) => setTimeout(r, 0));
  });
  return result;
}

describe('AgeGateDialog', () => {
  it('opens for unverified visitors with dialog semantics and focus on the confirm action', async () => {
    await renderGate();
    expect(screen.getByRole('dialog', { name: copy.title })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: copy.confirmLabel })).toHaveFocus();
    expect(document.documentElement).toHaveAttribute('data-age-gate', 'pending');
  });

  it('stays closed for a visitor who already confirmed', async () => {
    localStorage.setItem(AGE_GATE_STORAGE_KEY, JSON.stringify(createVerification(1, 30)));
    await renderGate();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.documentElement).not.toHaveAttribute('data-age-gate');
  });

  it('cannot be dismissed with Escape or an outside click', async () => {
    await renderGate();
    fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
    fireEvent.pointerDown(document.body);
    expect(screen.getByRole('dialog', { name: copy.title })).toBeInTheDocument();
  });

  it('confirming persists a versioned, expiring record and releases the page', async () => {
    await renderGate(3);
    vi.useFakeTimers({ toFake: ['setTimeout'] });
    fireEvent.click(screen.getByRole('button', { name: copy.confirmLabel }));
    const stored = JSON.parse(localStorage.getItem(AGE_GATE_STORAGE_KEY)!);
    expect(stored.version).toBe(3);
    expect(stored.expiresAt).toBeGreaterThan(Date.now());
    act(() => vi.runAllTimers());
    vi.useRealTimers();
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.documentElement).not.toHaveAttribute('data-age-gate');
  });

  it('rejecting without an exit URL keeps the site closed', async () => {
    const user = userEvent.setup();
    await renderGate();
    await user.click(screen.getByRole('button', { name: copy.rejectLabel }));
    expect(screen.getByRole('dialog', { name: copy.rejected.title })).toBeInTheDocument();
    expect(localStorage.getItem(AGE_GATE_STORAGE_KEY)).toBeNull();
    await user.click(screen.getByRole('button', { name: copy.rejected.backLabel }));
    expect(screen.getByRole('dialog', { name: copy.title })).toBeInTheDocument();
  });
});
