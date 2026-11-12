import { getCollection } from 'astro:content';

export type PostSummary = { slug: string; title: string; date: string; coverImage?: string; excerpt?: string };

// Published posts, newest first.
export async function getPosts() {
  const entries = await getCollection('posts', ({ data }) => data.published !== false);
  return entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const summarize = (entry: Awaited<ReturnType<typeof getPosts>>[number]): PostSummary => ({
  slug: entry.id,
  title: entry.data.title,
  date: entry.data.date.toISOString().slice(0, 10),
  coverImage: entry.data.coverImage,
  excerpt: entry.data.excerpt?.trim(),
});
