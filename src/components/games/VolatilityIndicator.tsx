import type { Volatility } from '@/config/schema/game.schema';
import { cn } from '@/lib/cn';
import { VOLATILITY, VOLATILITY_SCALE_MAX } from '@/lib/games/volatility';

/** Five-step volatility scale. The visible label carries the meaning; bars are decorative. */
export function VolatilityIndicator({ value, className }: { value: Volatility; className?: string }) {
  const { level, label } = VOLATILITY[value];
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <span aria-hidden="true" className="flex items-end gap-[3px]" data-level={level}>
        {Array.from({ length: VOLATILITY_SCALE_MAX }, (_, i) => (
          <span
            key={i}
            className={cn('w-[5px] rounded-[1px]', i < level ? 'bg-violet-400' : 'bg-white/12')}
            style={{ height: `${6 + i * 3}px` }}
          />
        ))}
      </span>
      <span>{label}</span>
    </span>
  );
}
