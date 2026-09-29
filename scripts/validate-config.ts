/**
 * pnpm validate:config
 *
 * Imports every configuration module (each validates itself with Zod on import),
 * checks that every referenced artwork file exists in /public, and resolves every
 * available game's launch URL against the trusted origins.
 */
import { existsSync } from 'node:fs';
import path from 'node:path';

process.env.NEXT_PUBLIC_GAME_BASE_URL ??= 'https://games.fnxstudio.com';

const problems: string[] = [];
const publicDir = path.resolve(import.meta.dirname, '../public');
const checkAsset = (owner: string, asset: string | undefined) => {
  if (asset && !existsSync(path.join(publicDir, asset))) problems.push(`${owner}: missing /public${asset}`);
};

const [{ games }, { jobs, careersPageContent }, { siteConfig }, { homeConfig }, { studioConfig }, { resolveGameLaunch }, { demoGames }, { gameCollectionSchema }] = await Promise.all([
  import('../src/config/games.config'),
  import('../src/config/careers.config'),
  import('../src/config/site.config'),
  import('../src/config/home.config'),
  import('../src/config/studio.config'),
  import('../src/lib/games/launch'),
  import('../src/content/visual-fixtures/games'),
  import('../src/config/schema/game.schema'),
  import('../src/config/navigation.config'),
  import('../src/config/contact.config'),
  import('../src/config/age-gate.config'),
]);

for (const game of games) {
  const { screenshots = [], ...art } = game.artwork;
  for (const [key, value] of Object.entries(art)) if (key !== 'alt') checkAsset(`game "${game.slug}" artwork.${key}`, value);
  screenshots.forEach((shot, i) => checkAsset(`game "${game.slug}" screenshot ${i + 1}`, shot));
  checkAsset(`game "${game.slug}" seo.image`, game.seo.image);
  try {
    resolveGameLaunch(game);
  } catch (error) {
    problems.push(error instanceof Error ? error.message : String(error));
  }
}

checkAsset('site defaultOgImage', siteConfig.defaultOgImage);
const pageArt: { src: string; mobileSrc?: string }[] = [
  homeConfig.hero.art,
  ...homeConfig.madeToHit.panels.map((p) => p.art),
  ...homeConfig.ideaToGame.stages.map((s) => s.art),
  studioConfig.intro.art,
  ...studioConfig.production.items,
  ...careersPageContent.gallery,
];
// Fixture games are validated too, so their artwork never renders as a fallback.
for (const game of gameCollectionSchema.parse(demoGames)) {
  const { screenshots = [], ...art } = game.artwork;
  for (const [key, value] of Object.entries(art)) if (key !== 'alt') checkAsset(`fixture "${game.slug}" artwork.${key}`, value);
  screenshots.forEach((shot, i) => checkAsset(`fixture "${game.slug}" screenshot ${i + 1}`, shot));
}
for (const art of pageArt) {
  checkAsset('page art', art.src);
  checkAsset('page art (mobile)', art.mobileSrc);
}

if (problems.length) {
  console.error(`Configuration problems:\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log(`Configuration valid: ${games.length} game(s), ${jobs.length} job(s).`);
