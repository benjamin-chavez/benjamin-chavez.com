// contentlayer.config.js

import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import { readFileSync } from 'fs';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkCodeTitles from 'remark-flexible-code-titles';
import readingTime from 'reading-time';
import { REMARK_CODE_TITLE_TAG_NAME } from './constants.ts';
import {
  rehypeAttachRawStringsToCodeContainer,
  rehypeEnrichCodeContainerMetadata,
} from 'rehype-clipboard-prep-code';

const THEME_PATH = './src/styles/greenery-theme.json';

/** @type {import('contentlayer/source-files').ComputedFields} */
const computedFields = {
  readingTime: {
    type: 'json',
    resolve: (doc) => readingTime(doc.body.raw),
  },
  slug: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath,
  },
  slugAsParams: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath.split('/').slice(1).join('/'),
  },
  structuredData: {
    type: 'object',
    resolve: (doc) => ({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: doc.title,
      datePublished: doc.publishedAt,
      dateModified: doc.publishedAt,
      description: doc.summary,
      image: doc.image
        ? `https://benjamin-chavez.com${doc.image}`
        : `https://benjamin-chavez.com/og?title=${doc.title}`,
      url: `https://benjamin-chavez.com/blog/${doc._raw.flattenedPath}`,
      author: {
        '@type': 'Person',
        name: 'Benjamin Chavez',
      },
    }),
  },
};

export const Blog = defineDocumentType(() => ({
  name: 'Blog',

  // filePathPattern: `blog/**/*.mdx`,
  filePathPattern: `**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    author: { type: 'string', required: true },
    description: { type: 'string', required: true },
    summary: {
      type: 'string',
      required: true,
    },
    publishedAt: { type: 'string', required: true },
    updatedAt: { type: 'string', required: true },
  },
  computedFields,
}));

export default makeSource({
  contentDirPath: './src/content',
  contentDirExclude: ['drafts'],
  documentTypes: [Blog],
  mdx: {
    remarkPlugins: [
      remarkGfm,
      [
        remarkCodeTitles,
        {
          titleTagName: REMARK_CODE_TITLE_TAG_NAME,
          titleClassName: 'custom-code-title',
          titleProperties: (language, title) => ({
            ['data-language']: language,
            title,
          }),
        },
      ],
    ],
    rehypePlugins: [
      rehypeAttachRawStringsToCodeContainer,
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: JSON.parse(readFileSync(THEME_PATH, 'utf-8')),
          onVisitLine(node) {
            // Prevent lines from collapsing in `display: grid` mode, and allow empty
            // lines to be copy/pasted
            if (node.children.length === 0) {
              node.children = [{ type: 'text', value: ' ' }];
            }
          },
          onVisitHighlightedLine(node) {
            node?.properties?.className?.push('line--highlighted');
          },
          onVisitHighlightedWord(node) {
            node.properties.className = ['word--highlighted'];
          },
        },
      ],
      rehypeEnrichCodeContainerMetadata,
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ['anchor'],
            ariaLabel: 'Link to section',
          },
        },
      ],
    ],
  },
});
