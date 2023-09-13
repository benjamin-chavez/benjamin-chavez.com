// src/app/sitemap.ts

import { allBlogs } from 'contentlayer/generated';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date();

  const filteredBlogs = allBlogs.filter((post) => {
    const publishDate = new Date(post.publishedAt);
    return publishDate <= today;
  });

  const blogs = filteredBlogs.map((post) => ({
    url: `https://benjamin-chavez.com/blog/${post.slug}/`,
    lastModified: post.updatedAt,
  }));

  const routes = ['', '/blog'].map((route) => ({
    url: `https://benjamin-chavez.com${route}/`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  return [...routes, ...blogs];
}
