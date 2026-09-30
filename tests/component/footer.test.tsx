import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from '@/components/layout/Footer';

describe('Footer', () => {
  it('uses icon-only contact links and a two-part close', () => {
    render(<Footer />);

    expect(screen.getByRole('link', { name: 'FNX Studio — home' })).toHaveAttribute('href', '/');
    expect(screen.getByText('Original games built with character, craft and production discipline.')).toBeInTheDocument();

    const email = screen.getByRole('link', { name: 'Email FNX Studio' });
    expect(email).toHaveAttribute('href', 'mailto:hello@fnx-studios.com');
    expect(email).toHaveAttribute('title', 'hello@fnx-studios.com');
    expect(screen.queryByText('hello@fnx-studios.com')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'LinkedIn' })).not.toBeInTheDocument();

    const linkedIn = screen.getByRole('link', { name: 'FNX Studio on LinkedIn (opens in a new tab)' });
    expect(linkedIn).toHaveAttribute('title', 'LinkedIn');
    expect(linkedIn).toHaveAttribute('href', 'https://www.linkedin.com/company/fnx-studio');
    expect(linkedIn).toHaveAttribute('target', '_blank');
    expect(linkedIn).toHaveAttribute('rel', 'noopener noreferrer');

    const nav = within(screen.getByRole('navigation', { name: 'Footer' }));
    expect(nav.getByRole('link', { name: 'Games' })).toHaveAttribute('href', '/games');
    expect(nav.getByRole('link', { name: 'Studio' })).toHaveAttribute('href', '/studio');
    expect(nav.getByRole('link', { name: 'Careers' })).toHaveAttribute('href', '/careers');
    expect(nav.getByRole('button', { name: 'Contact' })).toHaveAttribute('aria-haspopup', 'dialog');

    expect(screen.getByText(/© \d{4} FNX Studio/)).toBeInTheDocument();
    expect(screen.getByText(/18\+ Please play responsibly\./)).toBeInTheDocument();
  });
});
