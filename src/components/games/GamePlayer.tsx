'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react';
import type { GameOrientation } from '@/config/schema/game.schema';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/cn';
import { readGameFrameMessage } from '@/lib/games/messages';
import { routes } from '@/lib/routes';
import { Button, ButtonLink } from '@/components/ui/Button';
import { ArrowLeft, Collapse, Expand } from '@/components/ui/Icons';
import { Wordmark } from '@/components/ui/Wordmark';

export const GAME_LOAD_TIMEOUT_MS = 20_000;

export interface GamePlayerProps {
  slug: string;
  title: string;
  /** Fully resolved, allowlisted launch URL. */
  src: string;
  /** Origin of `src`; postMessage from any other origin is ignored. */
  origin: string;
  /** Sandbox tokens — only for third-party origins. First-party frames are not sandboxed. */
  sandbox?: string;
  orientation: GameOrientation;
  aspectRatio?: string;
  readySignal: boolean;
  backHref: string;
}

type Status = 'loading' | 'ready' | 'error';

const noopSubscribe = () => () => {};

/**
 * The single website runtime for every FNX game. It owns URL mounting, the loading
 * and failure states, fullscreen and viewport fitting — games need no custom code.
 */
export function GamePlayer({
  slug,
  title,
  src,
  origin,
  sandbox,
  orientation,
  aspectRatio,
  readySignal,
  backHref,
}: GamePlayerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const startedAt = useRef(0);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<Status>('loading');
  const [fullscreenSupported, setFullscreenSupported] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // The frame is only created after hydration, once the message listener exists —
  // otherwise a fast game could post "ready" before anyone is listening.
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);

  // Mirror of `status` for event handlers, so analytics fire exactly once per transition.
  const statusRef = useRef<Status>('loading');
  const transition = useCallback((next: Status) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  const markReady = useCallback(() => {
    if (statusRef.current !== 'loading') return;
    track({ name: 'game_iframe_loaded', props: { slug, ms: Math.round(performance.now() - startedAt.current) } });
    transition('ready');
  }, [slug, transition]);

  const markFailed = useCallback(
    (reason: 'timeout' | 'reported') => {
      // A timeout only matters while loading; a game may report failure at any time.
      if (statusRef.current === 'error' || (reason === 'timeout' && statusRef.current !== 'loading')) return;
      track({ name: 'game_iframe_failed', props: { slug, reason } });
      transition('error');
    },
    [slug, transition],
  );

  // Each attempt: start the clock, arm the timeout.
  useEffect(() => {
    startedAt.current = performance.now();
    track({ name: 'game_launch_started', props: { slug } });
    const timer = window.setTimeout(() => markFailed('timeout'), GAME_LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [attempt, slug, markFailed]);

  // Trusted messages from the game frame only.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const message = readGameFrameMessage(event, origin, frameRef.current?.contentWindow);
      if (!message) return;
      if (message.type === 'fnx:ready') markReady();
      else markFailed('reported');
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [origin, markReady, markFailed]);

  useEffect(() => {
    setFullscreenSupported(Boolean(document.fullscreenEnabled && rootRef.current?.requestFullscreen));
    const onChange = () => setIsFullscreen(document.fullscreenElement === rootRef.current);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await rootRef.current?.requestFullscreen({ navigationUI: 'hide' });
    } catch {
      // Fullscreen can be refused by the browser; the player keeps working windowed.
    }
  };

  const retry = () => {
    transition('loading');
    setAttempt((n) => n + 1);
  };

  const ratio = aspectRatio ?? (orientation === 'portrait' ? '9/16' : undefined);
  const frameBox: CSSProperties | undefined = ratio
    ? {
        aspectRatio: ratio,
        width: `min(100cqw, 100cqh * (${ratio}))`,
      }
    : undefined;

  return (
    <div ref={rootRef} className="fixed inset-0 flex flex-col bg-black text-text">
      <div className="flex h-12 shrink-0 items-center gap-3 border-b border-white/[0.06] bg-page px-2 sm:h-14 sm:px-4">
        <Link
          href={backHref}
          className="group/back inline-flex h-10 items-center gap-2 rounded-md px-2 text-small font-medium text-text-secondary transition-colors hover:text-text"
        >
          <ArrowLeft className="arrow-nudge size-5 group-hover/back:-translate-x-1" />
          <span className="sr-only sm:not-sr-only">Back to game</span>
        </Link>
        <h1 className="min-w-0 flex-1 truncate text-center text-small font-semibold text-text sm:text-body">{title}</h1>
        {fullscreenSupported ? (
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-pressed={isFullscreen}
            className="inline-flex h-10 items-center gap-2 rounded-md px-2 text-small font-medium text-text-secondary transition-colors hover:text-text"
          >
            {isFullscreen ? <Collapse className="size-5" /> : <Expand className="size-5" />}
            <span className="sr-only sm:not-sr-only">{isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}</span>
          </button>
        ) : (
          <span aria-hidden="true" className="w-10" />
        )}
      </div>

      <div className="relative flex-1 [container-type:size]">
        <div className="absolute inset-0 grid place-items-center">
          <div className={cn('relative', ratio ? 'max-h-full' : 'size-full')} style={frameBox}>
            {hydrated && status !== 'error' ? (
              <iframe
                key={attempt}
                ref={frameRef}
                src={src}
                title={`${title} — game`}
                allow="fullscreen; autoplay"
                allowFullScreen
                referrerPolicy="strict-origin"
                sandbox={sandbox}
                onLoad={readySignal ? undefined : markReady}
                className={cn(
                  'absolute inset-0 size-full border-0 bg-black transition-opacity duration-(--duration-editorial) ease-premium',
                  status === 'ready' ? 'opacity-100' : 'opacity-0',
                )}
              />
            ) : null}
          </div>
        </div>

        {orientation === 'landscape' ? (
          <p className="pointer-events-none absolute inset-x-0 bottom-6 hidden text-center text-small text-text-muted portrait:max-md:block">
            Rotate your device for a larger view.
          </p>
        ) : null}

        <div
          role="status"
          aria-live="polite"
          className={cn(
            'absolute inset-0 grid place-items-center bg-page transition-opacity duration-(--duration-editorial) ease-premium',
            status === 'loading' ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
        >
          {status === 'loading' ? (
            <div className="flex flex-col items-center text-center">
              <Wordmark className="h-5" />
              <p className="mt-6 text-small text-text-secondary">
                <span className="sr-only">Loading </span>
                {title}
              </p>
              <span aria-hidden="true" className="player-progress mt-5" />
            </div>
          ) : null}
        </div>

        {status === 'error' ? (
          <div role="alert" className="absolute inset-0 grid place-items-center bg-page px-6">
            <div className="flex max-w-sm flex-col items-center text-center">
              <Wordmark className="h-5" />
              <p className="mt-8 text-title text-text">We couldn’t load the game.</p>
              <p className="mt-3 text-small text-text-secondary">Check your connection and try again.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button onClick={retry}>Try again</Button>
                <ButtonLink href={routes.games} variant="secondary">
                  Back to games
                </ButtonLink>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
