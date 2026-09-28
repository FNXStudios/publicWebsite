import type { Game } from '@/config/schema/game.schema';

export interface GameFact {
  key: 'layout' | 'ways' | 'paylines' | 'rtp' | 'maxWin';
  label: string;
  value: string;
}

const numberFormat = new Intl.NumberFormat('en-GB');

/**
 * Builds the displayable facts for a game. Anything not configured is omitted — the
 * UI never renders "N/A" or empty placeholders. Volatility is rendered separately.
 */
export function getGameFacts(game: Game): GameFact[] {
  const { reels, rows, ways, paylines, rtp, maxWin } = game.info;
  const facts: GameFact[] = [];
  if (reels && rows) facts.push({ key: 'layout', label: 'Layout', value: `${reels} × ${rows}` });
  if (ways) facts.push({ key: 'ways', label: 'Ways to win', value: numberFormat.format(ways) });
  if (paylines) facts.push({ key: 'paylines', label: 'Paylines', value: numberFormat.format(paylines) });
  if (rtp !== undefined) facts.push({ key: 'rtp', label: 'RTP', value: `${rtp.toFixed(2).replace(/\.?0+$/, '')}%` });
  if (maxWin) facts.push({ key: 'maxWin', label: 'Max win', value: maxWin });
  return facts;
}

export function splitParagraphs(text: string | undefined): string[] {
  return text ? text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean) : [];
}
