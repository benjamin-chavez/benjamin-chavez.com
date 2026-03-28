# benjamin-chavez.com

<p align="center">
  <img src=".github/benjamin-chavez.com-preview.png" alt="benjamin-chavez.com application screenshot">
</p>

## CI/CD

See [`.github/CI-CD.md`](.github/CI-CD.md) for the live GitHub Actions pipeline, deployment flow, and release tagging behavior.

## Running Locally

Prerequisites:

- Node.js `24.x` from [`.nvmrc`](.nvmrc)
- PNPM `10.x`

Install and run the app:

```bash
git clone git@github.com:benjamin-chavez/benjamin-chavez.com.git
cd benjamin-chavez.com
pnpm install
cp .env.example .env.local
pnpm dev
```

The local dev server runs at [http://localhost:3000](http://localhost:3000).

## Root Scripts

- `pnpm dev`
  - Starts the Next.js development server with webpack.
- `pnpm run dev:clear-cache`
  - Deletes `.next/` and then starts the development server again.
- `pnpm run build`
  - Generates OG images and runs the production Next.js build. The OG-image prebuild step now loads the same local env files that `next build` uses, so the same command works in CI and on your machine. Because [`next.config.mjs`](next.config.mjs) sets `output: 'export'` and `distDir: 'dist'`, the static export is written to `dist/`.
- `pnpm run build:local`
  - Compatibility alias for `pnpm run build`.
- `pnpm run start`
  - Runs `next start`.
- `pnpm run lint`
  - Runs the configured Next.js lint command.

## Infrastructure Scripts

The AWS CDK package lives under [`infrastructure/`](infrastructure).

- `pnpm --dir infrastructure run build`
  - Compiles the edge handler and the infrastructure TypeScript sources.
- `pnpm --dir infrastructure run build:edge`
  - Compiles `infrastructure/edge/**/*.ts` into `infrastructure/dist/cloudfront/`.
- `pnpm --dir infrastructure run synth`
  - Rebuilds the edge handler and synthesizes the CloudFormation template.
- `pnpm --dir infrastructure run diff`
  - Rebuilds the edge handler and shows the CloudFormation diff.
- `pnpm --dir infrastructure run deploy`
  - Rebuilds the edge handler and runs `cdk deploy`.
