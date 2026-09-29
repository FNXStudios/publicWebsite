import { render, screen } from '@testing-library/react';
import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Reveal } from '@/motion/Reveal';

class FakeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe('Reveal', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', FakeObserver);
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ top: 5000, bottom: 5100 } as DOMRect);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('renders visible content and arms only after mount', () => {
    render(<Reveal>hello</Reveal>);
    expect(screen.getByText('hello')).toHaveAttribute('data-reveal', 'pending');
  });

  it('re-arms under Strict Mode instead of getting stuck', () => {
    render(
      <StrictMode>
        <Reveal>strict</Reveal>
      </StrictMode>,
    );
    expect(screen.getByText('strict')).toHaveAttribute('data-reveal', 'pending');
  });

  it('never arms without IntersectionObserver', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    render(<Reveal>plain</Reveal>);
    expect(screen.getByText('plain')).not.toHaveAttribute('data-reveal');
  });

  it('reveals a pending element once it scrolls into range', async () => {
    render(<Reveal>later</Reveal>);
    const el = screen.getByText('later');
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ top: 100, bottom: 200 } as DOMRect);
    window.dispatchEvent(new Event('scroll'));
    await vi.waitFor(() => expect(el).toHaveAttribute('data-reveal', 'shown'));
  });
});
