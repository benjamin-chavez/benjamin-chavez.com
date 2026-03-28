[//]: # (README.md)

# benjamin-chavez.com

<p align="center">
  <img src=".github/benjamin-chavez.com-preview.png" alt="benjamin-chavez.com application screenshot">
</p>

A statically exported personal site and blog built with Next.js and deployed on AWS.

---

## Tech Stack

### Frameworks & Frontend

- **[Next.js](https://nextjs.org/)** - React framework using the App Router and static export.
- **[React](https://react.dev/)** - UI library for the site experience.
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework for styling.
- **[Headless UI](https://headlessui.com/)** - Accessible unstyled components for interactive UI.
- **[MDX](https://mdxjs.com/)** - Content format for blog posts and long-form pages.

### Content & Build Tooling

- **[remark](https://remark.js.org/)** and **[rehype](https://rehype.js.org/)** - Markdown and HTML transforms for
  headings, code blocks, and metadata.
- **[Shiki](https://shiki.style/)** - Syntax highlighting for rendered code samples.
- **[Satori](https://github.com/vercel/satori)** and **[Sharp](https://sharp.pixelplumbing.com/)** - OG image generation
  during the build.
- **[pnpm](https://pnpm.io/)** - Package manager for the app and infrastructure packages.

### Core & Validation

- **[TypeScript](https://www.typescriptlang.org/)** - Static typing across the app and CDK infrastructure.
- **[Zod](https://zod.dev/)** - Runtime validation for client and build-time environment variables.
- **[Node.js](https://nodejs.org/)** - JavaScript runtime environment (v24.x).

### Infrastructure & Observability

- **[AWS CDK](https://aws.amazon.com/cdk/)** - Infrastructure as code for the hosting stack.
- **[Amazon S3](https://aws.amazon.com/s3/)** and **[Amazon CloudFront](https://aws.amazon.com/cloudfront/)** - Static
  hosting and CDN delivery.
- **[Amazon Route 53](https://aws.amazon.com/route53/)** and *
  *[AWS Certificate Manager](https://aws.amazon.com/certificate-manager/)** - DNS and TLS for the site domains.
- **[Amazon CloudWatch RUM](https://aws.amazon.com/cloudwatch/real-user-monitoring/)** - Client-side real user
  monitoring.
- **[Sentry](https://sentry.io/)** - Browser error tracking.

---

## CI/CD & Automation

GitHub Actions for build, Lighthouse audits, and deployment to AWS.

| Workflow | Trigger                              | Purpose                                  |
|----------|--------------------------------------|------------------------------------------|
| CI       | Push/PR to `master`, manual dispatch | Build, Lighthouse, and gated deploy flow |

For the full pipeline, see the [CI/CD documentation](.github/CI-CD.md).

---

## Deployment

Static export deployed to AWS (S3 + CloudFront) via CDK.

| Environment | URL                         |
|-------------|-----------------------------|
| Production  | https://benjamin-chavez.com |

For infrastructure details and CDK commands, see the [Infrastructure README](infrastructure/README.md).
For the first AWS deployment, use the [initial deployment runbook](infrastructure/INITIAL_DEPLOYMENT.md) and the checked-in helper script at [`scripts/initial-aws-deploy.sh`](scripts/initial-aws-deploy.sh).

---

## Scripts

| Command          | Description                                    |
|------------------|------------------------------------------------|
| `pnpm dev`       | Start the Next.js development server           |
| `pnpm run build` | Generate OG images and build the static export |
| `pnpm run start` | Run the production server locally              |
| `pnpm run lint`  | Run the Next.js lint command                   |

For infrastructure commands (CDK synth, diff, deploy), see the [Infrastructure README](infrastructure/README.md).

---

## Getting Started

Requires Node.js v24+ and pnpm.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

---

## Roadmap

- Add Cloudflare Web Analytics after the first AWS production cutover is stable.
- Add minimal browser-side Sentry once the AWS deployment flow is stable in production.
- Add CloudWatch RUM after the supporting AWS resources are provisioned.
