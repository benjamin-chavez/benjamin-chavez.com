// @ts-nocheck
// contentlayer.config.js

import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import { readFileSync } from 'fs';
import remarkGfm from 'remark-gfm';
// import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrismPlus from 'rehype-prism-plus';
import remarkCodeTitles from 'remark-flexible-code-titles';
import readingTime from "reading-time";

/** @type {import('contentlayer/source-files').ComputedFields} */
const computedFields: any = {
  readingTime: { type: "json", resolve: (doc) => readingTime(doc.body.raw) },
  slug: {
    type: 'string',
    // resolve: (doc) => `/${doc._raw.flattenedPath}`,
    resolve: (doc: any) => doc._raw.flattenedPath,
    // resolve: (doc) => doc._raw.flattenedPath.split('/').slice(1).join('/'),
  },
  slugAsParams: {
    type: 'string',
    resolve: (doc: any) => doc._raw.flattenedPath.split('/').slice(1).join('/'),
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
  documentTypes: [Blog],
  mdx: {
    remarkPlugins: [
      remarkGfm,
      [
        remarkCodeTitles,
        {
          // container: false,
          titleTagName: 'pre2',
          // titleTagName: 'pre',
          // titleTagName: 'div',
          titleClassName: 'custom-code-title',
          titleProperties: (language, title) => ({
            ['data-language']: language,
            title,
          }),
        },
      ],
    ],
    rehypePlugins: [
      rehypeSlug,
      [rehypePrismPlus, { ignoreMissing: true }],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            // className: ['anchor'],
            className: ['subheading-anchor'],
            ariaLabel: 'Link to section',
          },
        },
      ],
    ],
  },
});
