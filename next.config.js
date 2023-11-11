const { withContentlayer } = require('next-contentlayer');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  reactStrictMode: false,
  poweredByHeader: false,
  trailingSlash: false,
  headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  images: {
    domains: ['res.cloudinary.com', 'asset.cloudinary.com/'],
  },
  async redirects() {
    return [
      {
        source:
          '/blog/step-by-step-guide-setting-up-expressjs-typescript-web-app',
        destination:
          '/blog/creating-a-typescript-express.js-web-application-with-es6-step-by-step-guide',
        permanent: true,
      },
      {
        source: 'https://benjamin-chavez.com/downloads/epay-mailer',
        destination:
          'https://benjamin-chavez.com/downloads/Estimated%20Tax%20Payment%20Mailer.zip',
        permanent: true,
      },
    ];
  },
};

const ContentSecurityPolicy = `
  default-src 'self'  vercel.live;
  script-src 'self' https://localhost:12719 'unsafe-eval' 'unsafe-inline' va.vercel-scripts.com cdn.vercel-insights.com vercel.live https://www.youtube.com https://imgur.com/;
  frame-src youtube.com www.youtube.com https://imgur.com/;
  style-src 'self' 'unsafe-inline';
  img-src * blob: data:;
  media-src 'none';
  connect-src *;
  font-src 'self';
`;

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: 'X-Frame-Options',
    value: 'DENY',
    // value: 'SAMEORIGIN'
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
    //  value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
];
module.exports = withContentlayer(nextConfig);
