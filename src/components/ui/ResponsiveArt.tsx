import Image, { getImageProps } from 'next/image';
import type { CSSProperties } from 'react';
import { resolveArtSrc } from '@/lib/art/resolve';
import { cn } from '@/lib/cn';

interface ResponsiveArtProps {
  src: string;
  /** A separately composed image for narrow screens (art direction, not a crop). */
  mobileSrc?: string;
  /** Viewport width below which `mobileSrc` is used. Defaults to the md breakpoint. */
  mobileMaxWidth?: number;
  /** "" for decorative art. */
  alt: string;
  sizes: string;
  mobileSizes?: string;
  /** Above-the-fold art: fetched eagerly at high priority. */
  priority?: boolean;
  quality?: 70 | 80;
  className?: string;
  imgClassName?: string;
  /** CSS object-position. Prefer this over a one-off crop class when the focal point is known. */
  objectPosition?: string;
}

/**
 * Artwork that fills a positioned parent. The parent reserves the space (aspect
 * ratio or explicit height), so art never shifts layout.
 *
 * With `mobileSrc`, a <picture> is built from Next's optimizer output via
 * getImageProps(): each breakpoint gets its own composition and srcset, and the
 * browser only downloads the one it needs.
 */
export function ResponsiveArt({
  src: rawSrc,
  mobileSrc: rawMobileSrc,
  mobileMaxWidth = 899,
  alt,
  sizes,
  mobileSizes = '100vw',
  priority = false,
  quality = 70,
  className,
  imgClassName,
  objectPosition,
}: ResponsiveArtProps) {
  const src = resolveArtSrc(rawSrc);
  const mobileSrc = rawMobileSrc ? resolveArtSrc(rawMobileSrc) : undefined;
  const loading = priority ? 'eager' : 'lazy';
  const fetchPriority = priority ? 'high' : 'auto';
  const common = { fill: true, quality, loading, fetchPriority } as const;
  const imgStyle: CSSProperties | undefined = objectPosition ? { objectPosition } : undefined;
  const imgClass = cn('object-cover', imgClassName);
  /** Picture images must fill the frame. Next's fill styles are easy to drop, and a
   *  portrait file would otherwise sit at its own width and leave the hero empty. */
  const coverClass = 'absolute inset-0 h-full w-full max-w-none object-cover';
  const coverStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    maxWidth: 'none',
    objectFit: 'cover',
    ...(objectPosition ? { objectPosition } : {}),
  };

  if (!mobileSrc) {
    return (
      <div className={cn('art-slot absolute inset-0', className)}>
        <Image {...common} src={src} alt={alt} sizes={sizes} className={imgClass} style={imgStyle} />
      </div>
    );
  }

  const { props: desktop } = getImageProps({ ...common, src, alt, sizes });

  const {
    props: { srcSet: mobileSrcSet },
  } = getImageProps({ ...common, src: mobileSrc, alt, sizes: mobileSizes });

  return (
    <picture className={cn('art-slot absolute inset-0 block', className)}>
      <source media={`(max-width: ${mobileMaxWidth}px)`} srcSet={mobileSrcSet} sizes={mobileSizes} />
      <source media={`(min-width: ${mobileMaxWidth + 1}px)`} srcSet={desktop.srcSet} sizes={sizes} />
      <img {...desktop} alt={alt} className={cn(coverClass, imgClassName)} style={{ ...desktop.style, ...coverStyle }} />
    </picture>
  );
}
