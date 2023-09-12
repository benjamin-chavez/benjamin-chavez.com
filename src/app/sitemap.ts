// src/app/sitemap.ts

import { allBlogs } from 'contentlayer/generated';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const blogs = allBlogs.map((post) => ({
    url: `https://benjamin-chavez.com/${post.slug}`,
    lastModified: post.updatedAt,
  }));

  const routes = ['', '/blog'].map((route) => ({
    url: `https://benjamin-chavez.com/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  return [...routes, ...blogs];
}
