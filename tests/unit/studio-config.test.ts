import { describe, expect, it } from 'vitest';
import { studioConfig } from '@/config/studio.config';

describe('studio configuration', () => {
  it('contains the required narrative sections for the FNX studio story', () => {
    expect(studioConfig.about.eyebrow).toBe('STUDIO');
    expect(studioConfig.capabilities.eyebrow).toBe('WHAT WE DO');
    expect(studioConfig.reason.eyebrow).toBe('WHY FNX EXISTS');
    expect(studioConfig.philosophy.eyebrow).toBe('OUR PHILOSOPHY');
    expect(studioConfig.process.eyebrow).toBe('HOW WE WORK');
    expect(studioConfig.work.eyebrow).toBe('INSIDE THE WORK');
    expect(studioConfig.standard.eyebrow).toBe('THE STANDARD');
    expect(studioConfig.cta.eyebrow).toBe('WORK WITH US');
  });

  it('keeps the philosophy grounded in four deep principles and six process stages', () => {
    expect(studioConfig.philosophy.principles).toHaveLength(4);
    expect(studioConfig.process.stages).toHaveLength(6);
    expect(studioConfig.process.stages.map((stage) => stage.title)).toEqual([
      'Direction',
      'Game Design & Math',
      'Art Direction',
      'Build & Motion',
      'Play, Test, Refine',
      'Production',
    ]);
  });
});
