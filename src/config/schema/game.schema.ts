import { z } from 'zod';
import { hexColorSchema, imagePathSchema, slugSchema, svgPathSchema } from './primitives';

export const VOLATILITY_LEVELS = ['low', 'medium', 'medium-high', 'high', 'very-high'] as const;
export const GAME_STATUSES = ['available', 'coming-soon', 'hidden'] as const;
export const GAME_CATEGORIES = ['slot', 'instant'] as const;
export const GAME_ORIENTATIONS = ['landscape', 'portrait', 'responsive'] as const;

const listOfLabels = z.array(z.string().trim().min(1).max(60)).min(1).max(12);

export const gameSchema = z
  .object({
    id: slugSchema,
    slug: slugSchema,
    title: z.string().trim().min(1).max(60),
    shortDescription: z.string().trim().min(1).max(200),
    /** Long-form copy. Paragraphs are separated by a blank line. */
    description: z.string().trim().min(1).optional(),

    status: z.enum(GAME_STATUSES),
    category: z.enum(GAME_CATEGORIES),
    featured: z.boolean(),
    order: z.number().int().min(0),
    /**
     * Design fixture, never a shipped FNX title. Demo games render as non-linking cards,
     * are excluded from routes, sitemap and SEO, and only appear when demo content is enabled.
     */
    isDemo: z.boolean().optional(),

    artwork: z
      .object({
        thumbnail: imagePathSchema,
        thumbnailMobile: imagePathSchema.optional(),
        hero: imagePathSchema,
        heroMobile: imagePathSchema.optional(),
        poster: imagePathSchema.optional(),
        logo: z.union([svgPathSchema, imagePathSchema]).optional(),
        screenshots: z.array(imagePathSchema).min(1).max(12).optional(),
        /** Overrides the default "<title> key art" alt text. */
        alt: z.string().trim().min(1).max(160).optional(),
      })
      .strict(),

    game: z
      .object({
        /** Path on the environment's game origin (NEXT_PUBLIC_GAME_BASE_URL). Preferred. */
        launchPath: z
          .string()
          .regex(/^\/(?!\/)[^\s#]*$/, 'must be an origin-relative path such as "/golden-harbour/index.html"')
          .optional(),
        /** Absolute URL. Its origin must be first-party or declared in game-origins.config.ts. */
        launchUrl: z.url({ protocol: /^https$/ }).optional(),
        orientation: z.enum(GAME_ORIENTATIONS),
        /** CSS aspect ratio of the game canvas, e.g. "16/9". Omit for fully responsive games. */
        aspectRatio: z
          .string()
          .regex(/^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, 'must look like "16/9"')
          .optional(),
        /** The game posts `{ type: "fnx:ready" }` when it is interactive. */
        readySignal: z.boolean().default(false),
      })
      .strict()
      .refine((g) => !(g.launchPath && g.launchUrl), {
        message: 'set either launchPath or launchUrl, not both',
      }),

    info: z
      .object({
        volatility: z.enum(VOLATILITY_LEVELS).optional(),
        reels: z.number().int().min(1).max(12).optional(),
        rows: z.number().int().min(1).max(12).optional(),
        ways: z.number().int().positive().optional(),
        paylines: z.number().int().positive().optional(),
        /** Percent, e.g. 96.1. Only publish certified values. */
        rtp: z.number().min(80).max(99.99).optional(),
        /** Display string, e.g. "5,000x". Only publish certified values. */
        maxWin: z.string().trim().min(1).max(24).optional(),
        mechanics: listOfLabels.optional(),
        features: listOfLabels.optional(),
      })
      .strict()
      .default({}),

    /**
     * The game's own colours. Game pages let these dominate (FNX only frames them);
     * cards use the glow for a hint of light. Omit to fall back to neutral graphite.
     */
    theme: z
      .object({
        /** Bright signature colour, e.g. the gold of a logo. */
        accent: hexColorSchema,
        /** Saturated atmosphere colour used for light and gradients. */
        glow: hexColorSchema,
        /** Very dark tone of the world, used behind content on the game page. */
        deep: hexColorSchema,
      })
      .strict()
      .optional(),

    seo: z
      .object({
        title: z.string().trim().min(1).max(70).optional(),
        description: z.string().trim().min(1).max(200).optional(),
        image: imagePathSchema.optional(),
      })
      .strict()
      .default({}),
  })
  .strict()
  .superRefine((game, ctx) => {
    if (game.status === 'available' && !game.game.launchPath && !game.game.launchUrl) {
      ctx.addIssue({
        code: 'custom',
        path: ['game'],
        message: 'available games need game.launchPath or game.launchUrl',
      });
    }
    if (game.status === 'hidden' && game.featured) {
      ctx.addIssue({ code: 'custom', path: ['featured'], message: 'hidden games cannot be featured' });
    }
    if (game.info.ways && game.info.paylines) {
      ctx.addIssue({ code: 'custom', path: ['info'], message: 'set either ways or paylines, not both' });
    }
  });

export const gameCollectionSchema = z.array(gameSchema).superRefine((games, ctx) => {
  for (const key of ['id', 'slug'] as const) {
    const seen = new Set<string>();
    games.forEach((game, index) => {
      if (seen.has(game[key])) {
        ctx.addIssue({ code: 'custom', path: [index, key], message: `duplicate game ${key} "${game[key]}"` });
      }
      seen.add(game[key]);
    });
  }
});

export type GameInput = z.input<typeof gameSchema>;
export type Game = z.output<typeof gameSchema>;
export type Volatility = (typeof VOLATILITY_LEVELS)[number];
export type GameStatus = (typeof GAME_STATUSES)[number];
export type GameCategory = (typeof GAME_CATEGORIES)[number];
export type GameOrientation = (typeof GAME_ORIENTATIONS)[number];
