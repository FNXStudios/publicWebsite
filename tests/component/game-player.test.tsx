import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { GAME_LOAD_TIMEOUT_MS, GamePlayer, type GamePlayerProps } from '@/components/games/GamePlayer';

const props: GamePlayerProps = {
  slug: 'lantern-quarter',
  title: 'Lantern Quarter',
  src: 'https://games.fnxstudio.com/lantern-quarter/index.html',
  origin: 'https://games.fnxstudio.com',
  orientation: 'landscape',
  aspectRatio: '16/9',
  readySignal: false,
  backHref: '/games/lantern-quarter',
};

const frame = () => screen.getByTitle('Lantern Quarter — game') as HTMLIFrameElement;

afterEach(() => vi.useRealTimers());

describe('GamePlayer', () => {
  it('mounts the trusted URL with minimal capabilities and no sandbox for first-party games', () => {
    render(<GamePlayer {...props} />);
    expect(frame()).toHaveAttribute('src', props.src);
    expect(frame()).toHaveAttribute('allow', 'fullscreen; autoplay');
    expect(frame()).toHaveAttribute('referrerpolicy', 'strict-origin');
    expect(frame()).not.toHaveAttribute('sandbox');
  });

  it('shows a branded loading state until the frame loads', () => {
    render(<GamePlayer {...props} />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading Lantern Quarter');
    expect(frame().className).toContain('opacity-0');
    fireEvent.load(frame());
    expect(frame().className).toContain('opacity-100');
  });

  it('waits for a trusted ready message when the game declares readySignal', () => {
    render(<GamePlayer {...props} readySignal />);
    fireEvent.load(frame());
    expect(frame().className).toContain('opacity-0');

    act(() => {
      window.dispatchEvent(new MessageEvent('message', { origin: 'https://evil.example', data: { type: 'fnx:ready' }, source: frame().contentWindow }));
    });
    expect(frame().className).toContain('opacity-0');

    act(() => {
      window.dispatchEvent(new MessageEvent('message', { origin: props.origin, data: { type: 'fnx:ready' }, source: frame().contentWindow }));
    });
    expect(frame().className).toContain('opacity-100');
  });

  it('fails honestly on timeout and can retry', () => {
    vi.useFakeTimers();
    render(<GamePlayer {...props} />);
    act(() => vi.advanceTimersByTime(GAME_LOAD_TIMEOUT_MS + 1));
    expect(screen.getByRole('alert')).toHaveTextContent('We couldn’t load the game.');
    expect(screen.getByRole('link', { name: 'Back to games' })).toHaveAttribute('href', '/games');

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(frame()).toHaveAttribute('src', props.src);
  });

  it('does not fail a game that has already loaded', () => {
    vi.useFakeTimers();
    render(<GamePlayer {...props} />);
    fireEvent.load(frame());
    act(() => vi.advanceTimersByTime(GAME_LOAD_TIMEOUT_MS + 1));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('applies the declared sandbox for third-party origins', () => {
    render(<GamePlayer {...props} sandbox="allow-scripts allow-same-origin" />);
    expect(frame()).toHaveAttribute('sandbox', 'allow-scripts allow-same-origin');
  });
});
