import createMDX from '@next/mdx';
import { readFileSync } from 'fs';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkCodeTitles from 'remark-flexible-code-titles';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import {
  rehypeAttachRawStringsToCodeContainer,
  rehypeEnrichCodeContainerMetadata,
} from 'rehype-clipboard-prep-code';

const withMDX = createMDX({
  extension: /\.mdx$/,
  options: {
    remarkPlugins: [
      remarkFrontmatter, // strips YAML so MDX compiler ignores it
      remarkGfm,
      [
        remarkCodeTitles,
        {
          titleTagName: 'CodeBlockTitle',
          titleClassName: 'custom-code-title',
          titleProperties: (language, title) => ({
            ['data-language']: language,
            title,
          }),
        },
      ],
    ],
    // ORDER MATTERS — rehype-clipboard-prep-code plugins bracket rehype-pretty-code
    rehypePlugins: [
      rehypeAttachRawStringsToCodeContainer, // before pretty-code: reads raw code text
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: JSON.parse(
            readFileSync('./src/styles/greenery-theme.json', 'utf-8'),
          ),
          onVisitLine(node) {
            if (node.children.length === 0)
              node.children = [{ type: 'text', value: ' ' }];
          },
          onVisitHighlightedLine(node) {
            node?.properties?.className?.push('line--highlighted');
          },
          onVisitHighlightedWord(node) {
            node.properties.className = ['word--highlighted'];
          },
        },
      ],
      rehypeEnrichCodeContainerMetadata, // after pretty-code: reads data-rehype-pretty-code-fragment
      [
        rehypeAutolinkHeadings,
        {
          properties: { className: ['anchor'], ariaLabel: 'Link to section' },
        },
      ],
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  pageExtensions: ['ts', 'tsx', 'mdx'],
  reactStrictMode: false,
  poweredByHeader: false,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default withMDX(nextConfig);
