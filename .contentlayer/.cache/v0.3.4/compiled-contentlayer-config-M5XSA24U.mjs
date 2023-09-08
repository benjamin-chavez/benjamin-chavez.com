// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
var computedFields = {
  slug: {
    type: "string",
    // resolve: (doc) => `/${doc._raw.flattenedPath}`,
    resolve: (doc) => doc._raw.flattenedPath
    // resolve: (doc) => doc._raw.flattenedPath.split('/').slice(1).join('/'),
  },
  slugAsParams: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/")
  }
};
var Blog = defineDocumentType(() => ({
  name: "Blog",
  // filePathPattern: `blog/**/*.mdx`,
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    author: { type: "string", required: true },
    description: { type: "string", required: true },
    summary: {
      type: "string",
      required: true
    },
    publishedAt: { type: "string", required: true }
  },
  computedFields
}));
var themes = [
  "css-variables",
  "dark-plus",
  "dracula-soft",
  "dracula",
  "github-dark-dimmed",
  "github-dark",
  "github-light",
  "hc_light",
  "light-plus",
  "material-theme-darker",
  "material-theme-lighter",
  "material-theme-ocean",
  "material-theme-palenight",
  "material-theme",
  "min-dark",
  "min-light",
  "monokai",
  "nord",
  "one-dark-pro",
  "poimandres",
  "rose-pine-dawn",
  "rose-pine-moon",
  "rose-pine",
  "slack-dark",
  "slack-ochin",
  "solarized-dark",
  "solarized-light",
  "vitesse-dark",
  "vitesse-light"
];
var contentlayer_config_default = makeSource({
  contentDirPath: "./src/content",
  documentTypes: [Blog],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          // theme: JSON.parse(readFileSync(themePath, 'utf-8')),
          theme: themes[27],
          onVisitLine(node) {
            if (node.children.length === 0) {
              node.children = [{ type: "text", value: " " }];
            }
          },
          onVisitHighlightedLine(node) {
            node.properties.className.push("line--highlighted");
          },
          onVisitHighlightedWord(node) {
            node.properties.className = ["word--highlighted"];
          }
        }
      ],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ["anchor"],
            // className: ['subheading-anchor'],
            ariaLabel: "Link to section"
          }
        }
      ]
    ]
  }
});
export {
  Blog,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-M5XSA24U.mjs.map
