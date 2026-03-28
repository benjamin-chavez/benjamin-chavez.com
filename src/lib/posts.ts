import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

export interface Post {
  title: string;
  author: string;
  description: string;
  summary: string;
  image?: string;
  publishedAt: string;
  updatedAt: string;
  slug: string;
  readingTime: { text: string; minutes: number; words: number };
  structuredData: Record<string, unknown>;
}

const CONTENT_DIR = path.join(process.cwd(), 'src/content');

export function getAllPosts(): Post[] {
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, '');
      const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf-8');
      const { data, content } = matter(raw);
      const rt = readingTime(content); // body only, not frontmatter

      return {
        ...(data as Omit<Post, 'slug' | 'readingTime' | 'structuredData'>),
        slug,
        readingTime: {
          text: rt.text,
          minutes: Math.ceil(rt.minutes),
          words: rt.words,
        },
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: data.title,
          datePublished: data.publishedAt,
          dateModified: data.updatedAt,
          description: data.summary,
          image: data.image
            ? `https://benjamin-chavez.com${data.image}`
            : `https://benjamin-chavez.com/og/${slug}.png`,
          url: `https://benjamin-chavez.com/blog/${slug}/`,
          author: { '@type': 'Person', name: 'Benjamin Chavez' },
        },
      };
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

export function getPublishedPosts(): Post[] {
  const now = new Date();
  return getAllPosts().filter(
    (post) =>
      new Date(post.publishedAt) <= now ||
      process.env.NODE_ENV === 'development',
  );
}

export function getPostBySlug(slug: string): Post | undefined {
  return getPublishedPosts().find((p) => p.slug === slug);
}
