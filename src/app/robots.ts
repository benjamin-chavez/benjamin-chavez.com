// src/app/robots.ts

export const dynamic = 'force-static';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
      },
    ],
    sitemap: 'https://benjamin-chavez.com/sitemap.xml',
    host: 'https://benjamin-chavez.com',
  };
}
