import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { promises as fs } from 'node:fs';
import path from 'node:path';

// Known background images - fallback for serverless environments like Vercel
const KNOWN_BACKGROUNDS = ['image.png'];

async function getStaticBackgroundsDir(): Promise<string> {
  // Try multiple possible paths for different environments
  const cwd = process.cwd();
  const possiblePaths = [
    path.join(cwd, 'static', 'backgrounds'),
    path.join(cwd, '..', 'static', 'backgrounds'),
    // Vercel build path
    path.join(process.cwd(), '.vercel', 'output', 'static', 'backgrounds'),
  ];
  
  for (const dirPath of possiblePaths) {
    try {
      await fs.access(dirPath);
      return dirPath;
    } catch {
      continue;
    }
  }
  
  // Return first path as default (will be handled gracefully)
  return possiblePaths[0];
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
    
    // If we found files, return them
    if (urls.length > 0) {
      return json({ images: urls }, { status: 200 });
    }
    
    // Fallback to known backgrounds if filesystem read failed
    const fallbackUrls = KNOWN_BACKGROUNDS.map((name) => `/backgrounds/${name}`);
    return json({ images: fallbackUrls }, { status: 200 });
  } catch {
    // If directory doesn't exist or reading fails, return known backgrounds
    // This ensures the background works on Vercel even if filesystem access fails
    const fallbackUrls = KNOWN_BACKGROUNDS.map((name) => `/backgrounds/${name}`);
    return json({ images: fallbackUrls }, { status: 200 });
  }
};


