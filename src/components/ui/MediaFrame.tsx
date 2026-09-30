import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Reserved artwork frames. The ratio is the contract for Gate 2 art:
 * the slot keeps its size before the image loads, and object-fit is always cover.
 *
 * heroWide     cinematic hero region (portrait on small screens)
 * gameCard     featured-game cover
 * production   design / process plate
 * editorial    concept-to-result still
 * device       operator / delivery composition
 * gameHero     games-index feature and game-detail hero
 * motion       wide process strip
 * archive      gallery tile
 * archiveWide  gallery lead or closing proof
 */
const FRAME = {
  heroWide: 'aspect-[3/4] sm:aspect-[4/5] md:aspect-[8/5]',
  gameCard: 'aspect-[4/5]',
  production: 'aspect-[16/10]',
  editorial: 'aspect-[4/5] md:aspect-[5/4]',
  device: 'aspect-[4/3]',
  gameHero: 'aspect-[4/5] sm:aspect-[16/10] lg:aspect-[2/1]',
  motion: 'aspect-[16/9] md:aspect-[21/9]',
  archive: 'aspect-[16/10]',
  archiveWide: 'aspect-[16/9] md:aspect-[2/1]',
} as const;

export type MediaSlot = keyof typeof FRAME;

export function MediaFrame({ slot, className, children }: { slot: MediaSlot; className?: string; children?: ReactNode }) {
  return (
    <div data-slot={slot} className={cn('art-slot relative overflow-hidden rounded-lg border border-white/[0.08]', FRAME[slot], className)}>
      {children}
    </div>
  );
}
