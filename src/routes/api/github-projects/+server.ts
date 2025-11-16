import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  updated_at: string;
};

export const GET: RequestHandler = async ({ fetch, setHeaders }) => {
  try {
    // Fetch public repositories from reagent-systems organization
    const res = await fetch('https://api.github.com/orgs/reagent-systems/repos?type=public&sort=updated&per_page=100', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'reagent-site-3'
      }
    });

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const repos: GitHubRepo[] = await res.json();
    
    // Transform and filter repos
    const projects = repos
      .filter((repo) => !repo.name.includes('.github')) // Exclude .github repos
      .map((repo) => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description || 'No description available',
        url: repo.html_url,
        homepage: repo.homepage,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        topics: repo.topics || [],
        updatedAt: repo.updated_at
      }))
      .sort((a, b) => b.stars - a.stars); // Sort by stars descending

    setHeaders({
      'cache-control': 'public, max-age=3600' // Cache for 1 hour
    });

    return json({ projects }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch GitHub projects:', error);
    setHeaders({ 'cache-control': 'no-store' });
    return json({ projects: [] }, { status: 200 });
  }
};

