import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { promises as fs } from 'node:fs';
import path from 'node:path';

async function getStaticBackgroundsDir(): Promise<string> {
  // Assume the dev server is launched from the SvelteKit app directory
  // so the static dir is ./static. If not found, try ../static for safety.
  const cwd = process.cwd();
  const primary = path.join(cwd, 'static', 'backgrounds');
  const fallback = path.join(cwd, '..', 'static', 'backgrounds');
  try {
    await fs.access(primary);
    return primary;
  } catch {
    try {
      await fs.access(fallback);
      return fallback;
    } catch {
      return primary; // default; will fail upstream and return empty list
    }
  }
}

function isImageFile(fileName: string): boolean {
  const allowed = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);
  return allowed.has(path.extname(fileName).toLowerCase());
}

export const GET: RequestHandler = async () => {
  try {
    const dir = await getStaticBackgroundsDir();
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile() && isImageFile(e.name))
      .map((e) => e.name)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    const urls = files.map((name) => `/backgrounds/${name}`);
    return json({ images: urls }, { status: 200 });
  } catch {
    // If directory doesn't exist or reading fails, return empty list.
    return json({ images: [] }, { status: 200 });
  }
};


