import { z } from 'zod';

/** kebab-case identifier, safe for URLs and DOM ids. */
export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'must be lowercase kebab-case (e.g. "golden-harbour")');

/** An image served from /public. Remote hosts are intentionally not accepted. */
export const imagePathSchema = z
  .string()
  .regex(
    /^\/(?:[\w-]+\/)*[\w.-]+\.(?:avif|webp|png|jpe?g)$/,
    'must be a /public path to an avif, webp, png or jpg image (e.g. "/games/slug/thumb.jpg")',
  );

/** A /public path to an SVG (logos only). */
export const svgPathSchema = z
  .string()
  .regex(/^\/(?:[\w-]+\/)*[\w.-]+\.svg$/, 'must be a /public path to an .svg file');

export const httpsUrlSchema = z.url({ protocol: /^https$/, hostname: z.regexes.domain });

/** Internal route ("/games") or an absolute https / mailto link. */
export const hrefSchema = z.union([
  z.string().regex(/^\/(?!\/)[^\s]*$/, 'internal links must start with a single "/"'),
  httpsUrlSchema,
  z.string().regex(/^mailto:[^\s@]+@[^\s@]+$/, 'must be a valid mailto: link'),
]);
