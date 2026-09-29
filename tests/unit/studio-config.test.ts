import { describe, expect, it } from 'vitest';
import { studioConfig } from '@/config/studio.config';

describe('studio configuration', () => {
  it('tells one story in eight chapters, in reading order', () => {
    expect(Object.keys(studioConfig)).toEqual(['about', 'reason', 'capabilities', 'thinking', 'process', 'work', 'standard', 'cta']);
  });

  it('opens with substantial About copy and a quiet proof line, without an image', () => {
    expect(studioConfig.about.paragraphs.length).toBeGreaterThanOrEqual(2);
    expect(studioConfig.about.paragraphs.length).toBeLessThanOrEqual(3);
    expect(studioConfig.about.proof).toEqual(['5+ years building games', 'Original IP', 'Independent studio']);
    expect(studioConfig.about).not.toHaveProperty('art');
  });

  it('keeps philosophy to four principles, each with its own production visual', () => {
    expect(studioConfig.thinking.principles.map((p) => p.label)).toEqual(['Feel', 'Point of view', 'System', 'Detail']);
    for (const principle of studioConfig.thinking.principles) expect(principle.art.src).toMatch(/^\//);
  });

  it('offers exactly three capabilities under one unbroken headline', () => {
    expect(studioConfig.capabilities.headline).toBe('From an idea to a playable product.');
    expect(studioConfig.capabilities.items.map((item) => item.title)).toEqual(['Original games', 'Game production', 'Operator delivery']);
  });

  it('keeps six process stages and four larger work stories that end on the final build', () => {
    expect(studioConfig.process.stages.map((stage) => stage.title)).toEqual(['Direction', 'Game Design & Math', 'Art Direction', 'Build & Motion', 'Play, Test, Refine', 'Production']);
    expect(studioConfig.work.gallery.map((item) => item.label)).toEqual(['Symbol development', 'Art direction', 'Motion + UI', 'Final build']);
  });
});
