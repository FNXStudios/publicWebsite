/**
 * The postMessage protocol between a game frame and the website player.
 * Games that set `game.readySignal` post `{ type: 'fnx:ready' }` once interactive,
 * and may post `{ type: 'fnx:error' }` if they cannot start.
 */
export type GameFrameMessage = { type: 'fnx:ready' } | { type: 'fnx:error' };

const MESSAGE_TYPES: ReadonlySet<string> = new Set(['fnx:ready', 'fnx:error']);

/**
 * Accepts a message only if it comes from the expected origin AND the expected
 * frame window, and matches the protocol exactly. Everything else is ignored.
 */
export function readGameFrameMessage(
  event: Pick<MessageEvent, 'origin' | 'source' | 'data'>,
  expectedOrigin: string,
  expectedSource: MessageEventSource | null | undefined,
): GameFrameMessage | null {
  if (event.origin !== expectedOrigin) return null;
  if (!expectedSource || event.source !== expectedSource) return null;
  const data: unknown = event.data;
  if (typeof data !== 'object' || data === null || !('type' in data)) return null;
  const { type } = data;
  if (typeof type !== 'string' || !MESSAGE_TYPES.has(type)) return null;
  return type === 'fnx:ready' ? { type: 'fnx:ready' } : { type: 'fnx:error' };
}
