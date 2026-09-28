import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Client components are shipped to every visitor. They must receive content as
 * props rather than importing configuration modules (which bundle full Zod).
 */
function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? files(full) : /\.tsx?$/.test(name) ? [full] : [];
  });
}

const clientFiles = files(path.resolve(import.meta.dirname, '../../src')).filter((file) =>
  /^\s*['"]use client['"]/.test(readFileSync(file, 'utf8')),
);

describe('client boundaries', () => {
  it('finds the client components', () => {
    expect(clientFiles.length).toBeGreaterThan(3);
  });

  it.each(clientFiles.map((f) => [path.relative(process.cwd(), f), f]))('%s imports no config or full Zod', (_, file) => {
    const source = readFileSync(file, 'utf8');
    const valueImports = source.match(/^import (?!type )[^;]+;/gm) ?? [];
    for (const statement of valueImports) {
      expect(statement).not.toMatch(/@\/config\/(?!schema\/)[\w.-]+/);
      expect(statement).not.toMatch(/from 'zod'/);
    }
  });
});
