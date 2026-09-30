# Gate 1 — asset slot specification

Locked layout frames for Gate 2 artwork. Every slot uses `object-fit: cover`, reserves its box before the image loads, and fades in. Replace the interim file; do not change the frame.

Site container is 1440px with 56px desktop gutters (36px from 768px, 22px below that). Wide artwork may be full-bleed; its safe area is still measured against this grid.

| Page | Section | Component | Aspect ratio | Master export | Desktop crop | Mobile | Safe area | Transparency |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Home | Hero | Full-bleed hero (`Hero`) | Desktop visual region ~16:9 inside a capped hero. Mobile portrait crop fills the hero. | 2400×1350 landscape. Separate mobile master 1080×1620. | `object-position: 72% 42%`. Cover. | Dedicated `mobileSrc`. Focal point `50% 30%`. Copy sits in the lower ~40%. | Left ~45% (first 6 of 12 columns) must stay quiet on desktop. Lower 40% quiet on mobile. | Opaque. |
| Home | Featured games | `GameCard` / `gameCard` | 4:5 | 1200×1500 | Cover, per-game `objectPosition`. | Same frame, 2-up grid. | Bottom ~30% is the title scrim. Keep faces and key symbols above that. | Opaque. |
| Home | Made to hit | `MediaFrame` `production` | 16:10 | 1600×1000 | Cover, center. | Same ratio, full width, stacked. | No text over the image. Full frame is the picture. | Opaque. |
| Home | From idea to game | Stage frame | 16:10 | 1800×1125, one per phase (Concept, Design, Motion, Game) | Cover, center. Stable box; phases crossfade. | Same frame under a 2×2 tab row. | No text over the image. | Opaque. |
| Home | For operators | `MediaFrame` `device` | 4:3 | 1800×1350 | Cover, `72% 50%`. | Same ratio, stacked under the copy. | No text over the image. Subject can sit right of center. | Opaque, or transparent on the graphite frame. |
| Home | Closing CTA | Panel only | — | No artwork. | — | — | — | — |
| Studio | Hero | `MediaFrame` `editorial` | 4:5 below 900px, 5:4 from 900px | 1600×2000 (crop to 5:4 on desktop) | Cover, center. | 4:5, stacked under the copy. | No text over the image. | Opaque. |
| Studio | Capabilities | `MediaFrame` `production` ×3 | 16:10 | 1600×1000 each (Original games, Game production, Operator delivery) | Cover, center. | Same ratio, stacked. | No text over the image. | Opaque. |
| Studio | How we think | `MediaFrame` `production` ×3 | 16:10 | 1600×1000 (Feel, Point of view, System) | Cover, center. | Same ratio, stacked. | No text over the image. | Opaque. |
| Studio | Small decisions | `MediaFrame` `archive` ×2 | 16:10 | 1400×875 each | Cover, center. | Two-up, same ratio. | No text over the image. | Opaque. |
| Studio | One team | `MediaFrame` `device` | 4:3 | 1800×1350 | Cover, center. | Same ratio, above the stage list. | No text over the image. | Opaque, or transparent on graphite. |
| Studio | How a game takes shape | `archiveWide` then `archive` ×2 then `archiveWide` | Lead and final 16:9, then 2:1 from 900px. Middle pair 16:10. | Lead/final 2400×1200. Middle 1600×1000. | Cover. Motion + UI uses `object-position: 30% 50%`. | Single column, same ratios. | Caption sits under the frame, never on it. | Opaque. |
| Games | Lead feature | `MediaFrame` `gameHero` | 4:5, 16:10 from 640px, 2:1 from 1200px | 2400×1200 plus a mobile master 1080×1350 | Cover. Default focal point `68% 46%`, overridable per game. | Image, then copy underneath. Do not rely on the desktop overlay. | Desktop: left 42% is the type safe zone and must stay dark and quiet. | Opaque. |
| Games | Secondary covers | `GameCard` / `gameCard` | 4:5 | 1200×1500 | Cover, per-game focal point. | 2-up. | Bottom ~30% title scrim. | Opaque. |
| Game detail | Hero | `MediaFrame` `gameHero` | Same as the games lead feature, full bleed. | 2400×1200 plus mobile 1080×1350 | Cover, focal point from `artwork.objectPosition` or `68% 46%`. | Image, then copy underneath. | Desktop: left 40% is type. Keep the subject to the right. | Opaque. |
| Game detail | In-game stills | `archive` or `archiveWide` | 16:10, or 2:1 when a still spans the row | 2400×1200 wide, 1600×1000 half | Cover, center. | Stacked. | No text over the image. | Opaque. |
| Game detail | Key art | `gameCard` | 4:5 | 1200×1500 | Cover, center. | Full width above the copy. | No text over the image. | Opaque. |

## Fit and loading

- Fit is always `cover`. Nothing stretches.
- Below-fold images use lazy loading. Heroes and the games lead feature load eagerly.
- Where desktop and mobile composition differ, pass `mobileSrc` (`picture` / `srcSet`). Do not expect one crop to survive both.
- Frames expose `data-slot` (`gameCard`, `production`, `editorial`, `device`, `gameHero`, `archive`, `archiveWide`) for the implemented slots.

## Not a picture

Careers has no hero image. Contact is the global dialog, not a page, and has no artwork. The closing CTA panels are type only.
