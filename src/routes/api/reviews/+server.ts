import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

type Review = {
  authorName: string;
  rating: number;
  text: string;
  url?: string;
};

export const GET: RequestHandler = async ({ fetch, setHeaders }) => {
  try {
    const res = await fetch('/reviews.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load reviews.json');
    const parsed = (await res.json()) as { reviews?: Review[] } | Review[];
    const reviews = Array.isArray(parsed) ? parsed : parsed.reviews ?? [];
    const cleaned = reviews
      .filter((r) => r && r.text && r.rating)
      .map((r) => ({
        authorName: String(r.authorName ?? 'Anonymous'),
        rating: Math.max(1, Math.min(5, Number(r.rating) || 5)),
        text: String(r.text),
        url: r.url ? String(r.url) : undefined
      }));
    setHeaders({
      'cache-control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
    });
    return json({ reviews: cleaned }, { status: 200 });
  } catch {
    setHeaders({ 'cache-control': 'no-store' });
    return json({ reviews: [] }, { status: 200 });
  }
};


