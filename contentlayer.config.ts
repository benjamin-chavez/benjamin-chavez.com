// contentlayer.config.js

import { defineDocumentType, makeSource } from 'contentlayer/source-files';
// import { readFileSync } from 'fs';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

/** @type {import('contentlayer/source-files').ComputedFields} */
const computedFields = {
  slug: {
    type: 'string',
    // resolve: (doc) => `/${doc._raw.flattenedPath}`,
    resolve: (doc) => doc._raw.flattenedPath,
    // resolve: (doc) => doc._raw.flattenedPath.split('/').slice(1).join('/'),
  },
  slugAsParams: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath.split('/').slice(1).join('/'),
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
  },
  computedFields,
}));

// const themePath = './assets/themes/ctrl-markdown-theme.json';

export default makeSource({
  contentDirPath: './src/content',
  documentTypes: [Blog],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          // theme: JSON.parse(readFileSync(themePath, 'utf-8')),
          theme: 'one-dark-pro',
          onVisitLine(node) {
            // Prevent lines from collapsing in `display: grid` mode, and allow empty
            // lines to be copy/pasted
            if (node.children.length === 0) {
              node.children = [{ type: 'text', value: ' ' }];
            }
          },
          onVisitHighlightedLine(node) {
            node.properties.className.push('line--highlighted');
          },
          onVisitHighlightedWord(node) {
            node.properties.className = ['word--highlighted'];
          },
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ['anchor'],
            // className: ['subheading-anchor'],
            ariaLabel: 'Link to section',
          },
        },
      ],
    ],
  },
});
