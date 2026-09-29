# FNX Studio — website

Static-first Next.js site for FNX Studio: typed configuration, server-rendered UI, a few small client islands, and one isolated game player.

```
typed config (Zod-validated)  →  static pages (Server Components)  →  small client islands  →  /games/[slug]/play iframe
```

## Stack

| Package | Why |
| --- | --- |
| `next` 16 (App Router) | Static generation, metadata/sitemap/robots APIs, image optimisation, `next/font` |
| `react` 19 | — |
| `zod` 4 | Validates all product configuration at build/test time. The contact form uses `zod/mini`, so browsers only download the validators the form uses. |
| `tailwindcss` 4 | Token-driven utilities. Design tokens live as CSS custom properties in `src/app/globals.css`. |
| `class-variance-authority`, `clsx`, `tailwind-merge` | The one canonical `Button` (variants/sizes) and class composition |
| `motion` | Scroll-linked progress and small client islands (`LazyMotion` + `m`, so only the DOM animation features load). Never used to hide content. |
| `@radix-ui/react-dialog` | Accessible behaviour for the contact dialog, mobile menu and age gate (focus trap, inert page, focus return). All visuals are FNX's own. |
| `@radix-ui/react-select` | Keyboard-accessible "I'm interested in" selector, styled by FNX. |
| `lucide-react` | Two generic utility icons in the select (chevron, check). Brand-facing icons live in `src/components/ui/Icons.tsx`. |
| `vitest`, Testing Library, `jsdom` | Unit and component tests |
| `@playwright/test` | End-to-end tests against a production build, and the visual-fixture renderer |
| `tsx` | Runs `scripts/validate-config.ts` |

**Deliberately not used:** Material UI, Chakra, Ant, Bootstrap or any pre-styled kit (shadcn styling included); Three.js, particle engines, Lenis, scroll-jacking or a full-site canvas.

## Scripts (pnpm)

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server |
| `pnpm build` / `pnpm start` | Production build / serve |
| `pnpm validate:config` | Validates every config module, checks that all referenced artwork exists in `/public`, and resolves every launch URL |
| `pnpm lint` / `pnpm typecheck` / `pnpm test` | ESLint (Next + TS rules), `tsc --noEmit`, Vitest |
| `pnpm test:e2e` | Builds a fixture copy of the site into `.next-e2e`, then runs Playwright on desktop and mobile. First install a browser once with `pnpm exec playwright install chromium`, or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE`. |
| `pnpm check` | validate:config → lint → typecheck → unit/component tests |

## Environment

See `.env.example`. `.env.development` and `.env.production` hold safe defaults.

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | build | Canonical origin for metadata, sitemap and JSON-LD |
| `NEXT_PUBLIC_GAME_BASE_URL` | build | The game origin that `launchPath` resolves against. It is the only first-party `frame-src`. The build fails if it is missing or not https (except localhost). |
| `CONTACT_SUBMIT_ENDPOINT` | server | Where validated enquiries are POSTed as JSON. If unset, the API returns 503 and the form says it could not send. |
| `CONTACT_SUBMIT_TOKEN` | server | Optional bearer token for that endpoint |
| `ENABLE_HSTS` | server | `true` adds `Strict-Transport-Security` (only on hosts that are HTTPS end to end) |

Per environment, `NEXT_PUBLIC_GAME_BASE_URL` is `https://games.fnxstudio.com` (production), `https://games-staging.fnxstudio.com` (staging) or `http://localhost:4000` (local).

## Information architecture

Top-level pages are fixed: `/`, `/games`, `/studio`, `/careers`. Navigation: **Games · Studio · Careers**, plus the global **Get in touch** action.

- **Studio is the About page.** Technology is supporting credibility inside Studio and the homepage, never a destination.
- **Contact is a dialog, not a page.** Every "Get in touch" opens the same Radix dialog over the current page (`ContactProvider` + `ContactTrigger`). `/contact` redirects to `/?contact=open`, which opens it; `?interest=careers` (or `ContactTrigger interest="careers"`) preselects a topic.
- Product routes `/games/[slug]` and `/games/[slug]/play` exist but are not navigation destinations.

## Project layout

```
src/
  app/
    (site)/            marketing routes (header, footer, contact dialog via SiteChrome)
      page.tsx         /  Hero → Featured games → Made to hit → From idea to game → For operators → CTA
      games/ studio/ careers/
    (player)/games/[slug]/play/   stripped-down player route (no header/footer)
    api/contact/route.ts          contact submission boundary
  config/              ← all mutable content lives here (Zod-validated where it has business rules)
  content/visual-fixtures/        fixture games (development only, see below)
  lib/                 catalogue, launch URLs, contact schema, SEO, analytics, security headers, routes
  components/
    layout/            Header, Footer, SiteChrome, Container/Section, PageIntro
    ui/                Button, TextLink, ResponsiveArt, Typography, Icons, EmptyState
    contact/           ContactProvider (dialog), ContactTrigger, ContactForm
    games/             GameCard, GameRail, GameFeature, GameHero, GameInfo, GamePlayer
    home/              Hero, FeaturedGames, MadeToHit, IdeaToGame + StageStory, Operators, FinalCta
    studio/            ProcessStages
    age-gate/          AgeGate, AgeGateDialog
  motion/              tokens.ts, variants.ts, Reveal.tsx
scripts/
  validate-config.ts
  visual-fixtures/     SVG scene generator for fixture art (render.mjs)
tests/  unit/ component/ e2e/ fixtures/
```

**Rules the code follows**

- Configuration controls content; components control presentation. Page structure stays explicit in React. There is no JSON section engine.
- Client components never import configuration modules. A unit test (`tests/unit/client-boundaries.test.ts`) enforces this, so full Zod and config data stay out of the browser bundle. Server components render artwork and pass it into client islands as props.

## Layout system

Text is disciplined; artwork has freedom. They never share one container by default.

| Width | Token | Use |
| --- | --- | --- |
| reading | `--fnx-reading` 760px | long paragraphs, manifestos, forms |
| content | `--fnx-content` 1180px | two-column editorial, process, structured information |
| focus | `--fnx-focus` 1320px | focused closers (CTA) |
| wide | `--fnx-wide` 1480px | games, portfolio grids, large artwork, header, footer |
| full bleed | 100vw | hero art, world imagery, atmospheric backgrounds |

- Use `<Container size="reading | content | focus | wide">` (or the `container-*` utilities). Don't write one-off `max-w-[1376px]`-style frames.
- Full-bleed art: put it on the section itself with `<FullBleed>` (absolute, edge to edge) and keep the copy in a Container.
- Breaking out of the grid: `breakout-right` / `breakout-left` extend an item to the viewport edge from whatever container it sits in (each container exposes `--bleed`). The section must use `overflow-x-clip`. `full-bleed` makes an in-container element 100vw.
- Section spacing is semantic: `pt/pb-sec-sm | md | lg | xl`. Small when one section continues another; large or extra-large when the subject changes.
- Type scale: `text-hero`, `text-display`, `text-principle`, `text-heading`, `text-title`, `text-lead`, `text-body`, `text-small`. Avoid character-count clamps (`max-w-[9ch]`) on headlines; use art-directed lines or a rem max-width.
- Depth: `--depth-page` → `--depth-section` → `--depth-section-alt` → `--depth-raised` → `--depth-hover`. Violet is an accent; game art is the colour.

## Adding a game

1. Put artwork in `public/games/<slug>/`: `thumb.jpg` (4:5), `hero.png` (wide), plus optional `hero-mobile.jpg`, `thumb-mobile.jpg` and `screenshots/*.jpg`.
2. Add one entry to `src/config/games.config.ts`:

```ts
{
  id: 'golden-harbour',
  slug: 'golden-harbour',
  title: 'Golden Harbour',
  shortDescription: 'One or two sentences.',
  description: 'Optional long copy.\n\nSecond paragraph.',
  status: 'available',            // 'available' | 'coming-soon' | 'hidden'
  category: 'slot',               // 'slot' | 'instant'
  featured: true,
  order: 1,
  artwork: { thumbnail: '/games/golden-harbour/thumb.jpg', hero: '/games/golden-harbour/ hero.png' },
  game: {
    launchPath: '/golden-harbour/index.html',  // resolved against NEXT_PUBLIC_GAME_BASE_URL
    orientation: 'landscape',                   // 'landscape' | 'portrait' | 'responsive'
    aspectRatio: '16/9',
    readySignal: true,             // game posts { type: 'fnx:ready' } when interactive
  },
  info: { volatility: 'high', reels: 5, rows: 3, ways: 243 },   // only verified facts; omit the rest
  theme: { accent: '#ffe39a', glow: '#1fa56a', deep: '#03140c' },   // optional: the game's own colours on its page
  seo: {},
}
```

3. Run `pnpm validate:config`.

The homepage, `/games`, the detail page, the player, metadata, JSON-LD and the sitemap all update from this one entry. Do not edit any component.

- **Hidden** games never render and return 404.
- **Coming-soon** games get a detail page but no play route.
- Optional info (RTP, max win, volatility…) is simply left out of the UI when it is not set.

## Game player and iframe security

- The iframe exists only on `/games/[slug]/play`. It is created after hydration, so a fast game cannot post "ready" before the player is listening. Marketing pages never request game assets (an E2E test checks this).
- **Launch URL:** `launchPath` is joined onto `NEXT_PUBLIC_GAME_BASE_URL` at build time. An absolute `launchUrl` must match the first-party origin or an entry in `src/config/game-origins.config.ts`. Anything else fails the build.
- **Third-party origins** must declare a `reason` and an explicit `sandbox` token list. Navigation-escaping tokens are rejected by the schema.
- **First-party frames are not sandboxed.** A cross-origin frame with `allow-scripts allow-same-origin` gains nothing from a sandbox, and a sandbox risks breaking storage, WebGL and audio.
- **iframe attributes:** `allow="fullscreen; autoplay"` and `referrerpolicy="strict-origin"`. `Permissions-Policy` delegates only fullscreen and autoplay, and only to the trusted game origins.
- **postMessage:** a message is accepted only when `event.origin` and `event.source` match the game frame and the payload is `{ type: 'fnx:ready' | 'fnx:error' }` (`src/lib/games/messages.ts`).
- **Loading and failure:** until the game is ready the player shows a branded loading state, with no white flash. After a 20 s timeout, or when the game reports `fnx:error`, it shows "We couldn't load the game." with **Try again** and **Back to games**.

## Security headers

`src/lib/security/headers.ts` sets:

- `Content-Security-Policy` — `frame-src` limited to game origins, `frame-ancestors 'none'`, `object-src 'none'`, and `connect-src 'self'`.
- `Permissions-Policy`, `Referrer-Policy`, `X-Content-Type-Options`, `X-Frame-Options` and `Cross-Origin-Opener-Policy`.
- HSTS, only when `ENABLE_HSTS=true`.

**Trade-off:** `script-src` and `style-src` include `'unsafe-inline'`.

- Scripts: every page is statically prerendered, and Next.js emits inline bootstrap scripts. Nonces would force dynamic rendering of every page.
- Styles: `next/font` and inline style attributes need it.
- `'unsafe-eval'` is present in development only.
- For a stricter policy, move to a nonce-based `proxy.ts` and accept dynamic rendering.

## Design system

**Quiet brand frame, loud games.** Graphite, precise and editorial; the games bring colour, character and movement and are never desaturated to fit the UI.

- **Tokens** (`src/app/globals.css`, exposed to Tailwind via `@theme`): the graphite ladder `--fnx-black-950…650`, text (`primary/secondary/muted`), borders, violet `700…300` + `soft/border/glow`, warm light, shadows (`soft`, `card-hover`, `violet`), radii, motion.
- **Depth:** page (`950/900`) → section (`850/800`) → raised interactive (`750/700`) → featured (imagery + controlled violet). Homepage tones: hero 900 → featured 850 → made 900 → idea 800 → operators 900 → CTA raised → footer 950. Transitions come from tone and imagery, not divider lines.
- **Type** (Manrope variable, self-hosted): `text-hero` (≈88px, lh .96, −0.035em), `text-display` (≈64px), `text-display-sm`, `text-title`, `text-lead`, `text-body`, `text-small`, `text-eyebrow` (12px, .2em).
- **Button:** one CVA component — `primary | secondary | ghost | text` × `sm | md | lg`. Primary: barely-there `#8951ff → #7134f4` gradient, 1px violet rim, lit top edge, soft violet contact shadow; hover −1px/+4% brightness, press .985, 2px violet focus ring. `TextLink` / `ContactTrigger appearance="link"` share one text-action style (animated rule, arrow nudge).
- **Game colour:** games may declare `theme: { accent, glow, deep }`. Game pages let it dominate (hero gradients, title, chips); cards use the glow for hover light. FNX violet stays on primary actions.
- **Motion** (`src/motion/tokens.ts`): micro 170 · interaction 260 · standard 340 · editorial 550 · hero 850 ms, easing `[0.16, 1, 0.3, 1]`, no bouncy springs. Above-the-fold entrances and ambient light are CSS only. `Reveal` fades below-the-fold content once but content is **server-rendered visible** and only armed after hydration if still off-screen. `prefers-reduced-motion` removes ambient motion, scroll-linked transforms and reveals.

## Age gate

Configured in `src/config/age-gate.config.ts` (copy, `minimumAge`, `version`, `rememberDays`, optional `exitUrl`).

- A tiny inline `<head>` script marks `<html data-age-gate="pending">` before first paint when no valid confirmation exists; CSS then covers the page with the blurred scrim, so nothing is usable before hydration.
- `AgeGateDialog` is a Radix modal Dialog: focus trap, inert page and dialog semantics. Escape, outside pointer and outside interaction are all prevented — only an answer closes it.
- Confirming stores `{ version, verifiedAt, expiresAt }` under `fnx_age_verified` in localStorage (sessionStorage if blocked). Bump `version` to ask everyone again.
- Declining goes to `exitUrl` if configured; otherwise the gate stays with the "adults only" copy.

## Remaining TODOs (need real inputs)

- **Games:** `games.config.ts` is empty until real titles, launch paths, verified info and artwork arrive. In production builds the homepage then omits Featured games and `/games` shows its designed empty state.
- **Artwork:** `public/art/hero*.jpg` and everything in `public/visual-fixtures/` is generated interim art. Replace with the final hero illustration and real production material (Golden Chinatown symbol sheets, frames, UI work), then update paths in `home.config.ts`, `studio.config.ts` and `careers.config.ts`.
- **Business facts:** public email / social profiles (`site.config.ts` — they appear in the footer and contact dialog only once set); operator capabilities (`home.config.ts`, `TODO(business)`); responsible-gaming URL and age-gate `exitUrl`.
- **Contact delivery:** set `CONTACT_SUBMIT_ENDPOINT`; add rate limiting at the edge/WAF.
- **Known framework log:** `next start` logs `Error: Internal: NoFallbackError` for unknown game slugs. The response is a correct static 404.

## Visual fixtures (development artwork)

So the design can be judged with colourful, real-looking content while the catalogue is empty:

- **Fixture games** live in `src/content/visual-fixtures/games.ts` (Dragon's Fortune, Mystic Tides, Temple of Valor) — never in `games.config.ts`. They show only when `NEXT_PUBLIC_USE_DEMO_CONTENT=true` (default in `next dev`) **and** no real game exists. They are `noindex`, have no JSON-LD, are never in the sitemap and are never playable.
- **Fixture art** (`public/visual-fixtures/`, plus `public/art/hero*.jpg`) is rendered from SVG scenes: `node scripts/visual-fixtures/render.mjs [scene…]` (uses Playwright's Chromium; set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` if needed).
- Visitors never see "fixture/demo/placeholder" labels. A small debug marker appears on fixture cards only with `NEXT_PUBLIC_SHOW_FIXTURE_LABELS=true`.
- Remove fixtures entirely by deleting `src/content/visual-fixtures/`, `public/visual-fixtures/` and `scripts/visual-fixtures/` (and the import in `src/lib/games/catalog.ts`).
