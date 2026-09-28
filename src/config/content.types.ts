/**
 * Shapes for editorial page copy. Copy is plain typed data (checked by `satisfies`);
 * product data with business rules — games, jobs, site, navigation — is validated
 * with Zod instead.
 */

export interface LinkContent {
  label: string;
  href: string;
}

/** A headline split into art-directed lines. Lines break on desktop and flow on mobile. */
export type HeadlineLines = readonly [string, ...string[]];

export interface ArtContent {
  src: string;
  mobileSrc?: string;
  /** Empty string for decorative artwork. */
  alt: string;
}

export interface TitledCopy {
  title: string;
  body: string;
}
