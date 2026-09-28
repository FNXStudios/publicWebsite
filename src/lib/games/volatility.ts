import type { Volatility } from '@/config/schema/game.schema';

export const VOLATILITY_SCALE_MAX = 5;

/** The single mapping from volatility level to scale position and label. */
export const VOLATILITY: Record<Volatility, { level: number; label: string }> = {
  low: { level: 1, label: 'Low' },
  medium: { level: 2, label: 'Medium' },
  'medium-high': { level: 3, label: 'Medium–high' },
  high: { level: 4, label: 'High' },
  'very-high': { level: 5, label: 'Very high' },
};
