// src/app/sitemap.ts

export const dynamic = 'force-static';

import { getPublishedPosts } from '@/lib/posts';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const blogs = getPublishedPosts().map((post) => ({
    url: `https://benjamin-chavez.com/blog/${post.slug}/`,
    lastModified: post.updatedAt,
  }));

  const routes = ['', '/blog'].map((route) => ({
    url: `https://benjamin-chavez.com${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  return [...routes, ...blogs];
}
