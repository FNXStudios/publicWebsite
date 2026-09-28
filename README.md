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
| `class-variance-authority`, `clsx`, `tailwind-merge` | Button variants and class composition |
| `tailwindcss` 4 | Token-driven utilities. Design tokens live as CSS custom properties in `src/app/globals.css`. |
| `vitest`, Testing Library, `jsdom` | Unit and component tests |
| `@playwright/test` | End-to-end tests against a production build |
| `tsx` | Runs `scripts/validate-config.ts` |
| `@fontsource-variable/manrope` (dev) | Source of the self-hosted Manrope variable font file (copied into `src/app/fonts`) |

**Considered and left out on purpose**

- **Motion / Framer Motion.** It was measured at about 39 KB gzip on every page. It would have been used only for reveal-once fades, and one `IntersectionObserver` plus CSS does that (`src/motion/Reveal.tsx`). If gesture or layout animation is needed later, add Motion (`LazyMotion`) to that one component.
- **Radix.** The native `<dialog>` handles the mobile menu (focus containment, Esc, inert background), and a native `<select>` is fully accessible and better on mobile.
- **Lucide.** The site needs seven utility icons, drawn on a single grid in `src/components/ui/Icons.tsx`.

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

## Project layout

```
src/
  app/
    (site)/            marketing routes with header + footer
      page.tsx         /
      games/           /games, /games/[slug]
      studio/ careers/ contact/
    (player)/games/[slug]/play/   stripped-down player route (no header/footer)
    api/contact/route.ts          contact submission boundary
    sitemap.ts robots.ts not-found.tsx icon.svg layout.tsx globals.css
  config/              ← all mutable content lives here
    schema/            Zod schemas (game, site/navigation, career, contact, game origins)
    site / navigation / home / games / studio / careers / contact / game-origins .config.ts
  lib/
    games/             catalog selectors, launch URL resolution, origins, postMessage protocol, volatility, facts
    contact/           shared schema (zod/mini), server binding, delivery boundary
    security/headers.ts  CSP, Permissions-Policy and other headers
    seo/metadata.ts    page and game metadata, JSON-LD
    analytics/         vendor-neutral track()
    routes.ts          the only place route strings are built
  components/
    layout/ ui/ home/ games/ contact/
  motion/Reveal.tsx    scroll reveal
tests/  unit/ component/ e2e/ fixtures/
```

**Rules the code follows**

- Configuration controls content; components control presentation. Page structure stays explicit in React. There is no JSON section engine.
- Client components never import configuration modules. A unit test (`tests/unit/client-boundaries.test.ts`) enforces this, so full Zod and config data stay out of the browser bundle.

## Adding a game

1. Put artwork in `public/games/<slug>/`: `thumb.jpg` (4:5), `hero.jpg` (wide), plus optional `hero-mobile.jpg`, `thumb-mobile.jpg` and `screenshots/*.jpg`.
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
  artwork: { thumbnail: '/games/golden-harbour/thumb.jpg', hero: '/games/golden-harbour/hero.jpg' },
  game: {
    launchPath: '/golden-harbour/index.html',  // resolved against NEXT_PUBLIC_GAME_BASE_URL
    orientation: 'landscape',                   // 'landscape' | 'portrait' | 'responsive'
    aspectRatio: '16/9',
    readySignal: true,             // game posts { type: 'fnx:ready' } when interactive
  },
  info: { volatility: 'high', reels: 5, rows: 3, ways: 243 },   // only verified facts; omit the rest
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

- **Tokens:** colours, radii, motion and layout are CSS custom properties in `src/app/globals.css`, exposed to Tailwind through `@theme`.
  - Type scale: `text-display-xl/lg/md`, `title`, `lead`, `body`, `small`, `eyebrow`.
  - Breakpoints: 640 / 900 / 1200 / 1600.
  - Container: about 1376 px plus fluid gutters.
- **Colour:** graphite surfaces, off-white type and FNX violet (`--color-accent`) used only for primary actions, focus and small signals.
- **Headlines:** configured as arrays of lines. They break as art-directed on screens ≥640 px and flow naturally on phones.
- **Motion:** above-the-fold entrances are CSS-only, so LCP never waits for JavaScript. Below the fold, `Reveal` fades content up once. `prefers-reduced-motion` disables all of it.

## Remaining TODOs (need real inputs)

- **Games:** `games.config.ts` is empty until real titles, launch paths, verified info and artwork arrive. `/games` shows its designed empty state, and the homepage leaves out the featured section.
- **Artwork:** `public/art/*.jpg` and `public/og.jpg` are interim, procedurally rendered studio art. Replace them with final illustrations and real production material (sketches, symbol sheets, UI frames), then update the paths in `home.config.ts` and `studio.config.ts`.
- **Logo:** `Wordmark.tsx` is a typeset placeholder. `app/icon.svg` is a placeholder mark. Both need the official FNX logo.
- **Business facts:**
  - Public email and social profiles in `site.config.ts`.
  - Confirm the operator claims (`home.config.ts`) and the studio capabilities (`studio.config.ts`); both are marked `TODO(business)`.
  - Confirm the footer 18+ notice wording for your target markets.
- **Contact delivery:** set `CONTACT_SUBMIT_ENDPOINT` (form service, CRM webhook or internal API). Add rate limiting at the edge/WAF; the route has a honeypot and a size limit but no per-IP throttle.
- **Deployment:**
  - Set `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_GAME_BASE_URL` per environment.
  - Enable `ENABLE_HSTS` on HTTPS hosts.
  - Wire an analytics vendor by listening for `fnx:analytics` events or providing `window.dataLayer`.
- **Known framework log:** `next start` logs `Error: Internal: NoFallbackError` for unknown game slugs. The response is a correct static 404; the log comes from Next 16's handling of `dynamicParams = false`.
