// News posts: Markdown files edited in Keystatic (public/content/blog/*.md), rendered to static pages.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ pattern: '*.md', base: './public/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    published: z.boolean().optional().default(true),
    coverImage: z.string().optional(),
    excerpt: z.string().optional(),
  }),
});

// Standalone pages edited in Keystatic (e.g. the privacy policy).
const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { posts, pages };
