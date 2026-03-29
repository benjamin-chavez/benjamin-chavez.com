[//]: # (.github/CI-CD.md)

## CI/CD & Automation

This repo uses GitHub Actions to build, audit, and deploy a static Next.js export to AWS S3 + CloudFront. The deploy workflow assumes the infrastructure stack already exists and reads its deploy targets from CloudFormation outputs.

### Workflow Layout

| Workflow | File | Trigger | Purpose |
|----------|------|---------|---------|
| CI | [`./workflows/ci.yml`](./workflows/ci.yml) | Push to `master`, pull request to `master`, manual dispatch | Orchestrates Actionlint, build, Lighthouse, and gated deploy |
| Lint GitHub Actions | [`./workflows/lint-github-actions.yml`](./workflows/lint-github-actions.yml) | `workflow_call` | Installs pinned `actionlint` and validates workflow files |
| Build Static Site | [`./workflows/build-static-site.yml`](./workflows/build-static-site.yml) | `workflow_call` | Builds the static site and uploads the deployable `dist/` artifact |
| Lighthouse Static Site | [`./workflows/lighthouse-static-site.yml`](./workflows/lighthouse-static-site.yml) | `workflow_call` | Downloads the build artifact and runs Lighthouse CI against it |
| Deploy Static Site | [`./workflows/deploy-static-site.yml`](./workflows/deploy-static-site.yml) | `workflow_call` | Downloads the artifact, deploys it to AWS, invalidates CloudFront, and creates the next deployment tag |

### Live CI Flow

The top-level CI workflow in [`./workflows/ci.yml`](./workflows/ci.yml) wires the reusable workflows together with the current repo defaults:

| Setting | Current value |
|---------|---------------|
| `AWS_REGION` | GitHub repo variable `vars.AWS_REGION` |
| `CDK_STACK_NAME` | GitHub repo variable `vars.CDK_STACK_NAME` |
| `APP_URL` | GitHub repo variable `vars.APP_URL` |
| `ARTIFACT_NAME` | `dist` |
| `TAG_PREFIX` | `v` |

Jobs run in this order:

| Job | What it does |
|-----|--------------|
| Actionlint | Checks out the repo, installs `actionlint` `v1.7.11` from the official release, and validates `.github/workflows/*.yml` |
| Build | Checks out the repo, installs PNPM, sets up Node from [`.nvmrc`](../.nvmrc), runs `pnpm install --frozen-lockfile`, runs `pnpm build`, and uploads `dist/` |
| Lighthouse | Downloads the same `dist/` artifact and runs `npx @lhci/cli autorun` |
| Deploy | Runs only after Actionlint, Build, and Lighthouse succeed, and only for `push` or `workflow_dispatch` on `refs/heads/master` |

`actionlint` is intentionally scoped to workflow files only. It does not validate repo-local composite action metadata under `.github/actions/`.

### GitHub Actions Linting

Workflow linting is defined in [`./workflows/lint-github-actions.yml`](./workflows/lint-github-actions.yml).

| Step | What it does |
|------|--------------|
| Checkout | Checks out the repo so `actionlint` can inspect all local workflow files and reusable workflow calls |
| Install actionlint | Downloads the pinned official release archive for the current Linux runner architecture and adds the extracted binary to `PATH` |
| Run actionlint | Runs `actionlint` from repo root with default project discovery |

### Build Artifact

The deploy artifact is the static export in `dist/`.

- [`next.config.mjs`](../next.config.mjs) sets `output: 'export'` and `distDir: 'dist'`.
- [`package.json`](../package.json) defines `pnpm build` as `tsx scripts/generate-og-images.tsx && next build --webpack`.
- [`scripts/generate-og-images.tsx`](../scripts/generate-og-images.tsx) generates OG images into `public/og` before the static export runs.

### Lighthouse Behavior

Lighthouse CI is configured by [`.lighthouserc.js`](../.lighthouserc.js).

| Setting | Current value |
|---------|---------------|
| `staticDistDir` | `./dist` |
| URLs audited | `http://localhost/index.html`, `http://localhost/blog/index.html` |
| `numberOfRuns` | `3` |
| Upload target | `temporary-public-storage` |

Current assertions:

| Category | Level | Minimum score |
|----------|-------|---------------|
| Performance | `warn` | `0.9` |
| Accessibility | `error` | `0.9` |
| Best Practices | `warn` | `0.9` |
| SEO | `warn` | `0.9` |

The workflow always uploads `.lighthouseci/` as the `lighthouse-results` artifact, even when the job fails.

### Deployment Behavior

Deploy is defined in [`./workflows/deploy-static-site.yml`](./workflows/deploy-static-site.yml).

| Step | What it does |
|------|--------------|
| Checkout | Checks out the repo with `fetch-depth: 0` so tags are available |
| Download artifact | Downloads the `dist/` artifact into `dist/` |
| Configure AWS | Uses GitHub OIDC with `AWS_DEPLOY_ROLE_ARN` via `aws-actions/configure-aws-credentials@v4` |
| Read stack outputs | Calls `aws cloudformation describe-stacks` for `cdk_stack_name` and reads `BucketName` and `DistributionId` |
| Sync to S3 | Runs `aws s3 sync dist/ "s3://$BUCKET" --delete` |
| Invalidate CloudFront | Runs `aws cloudfront create-invalidation --distribution-id "$DIST_ID" --paths "/*"` |
| Tag deployment | Fetches tags, finds the latest matching semver tag, bumps the patch version, creates the new tag, and pushes it |

Additional live deploy behavior:

- Deploys are serialized with the `production-deploy` concurrency group.
- `cancel-in-progress` is `false`.
- This workflow deploys static assets only. It does not run `cdk deploy` or update infrastructure.

### Versioning

Successful deploys create the next patch tag matching `TAG_PREFIX`.

| Example | Result |
|---------|--------|
| No existing tags | `v0.0.1` |
| Latest tag is `v1.0.0` | Next deploy creates `v1.0.1` |
| Latest tag is `v1.4.9` | Next deploy creates `v1.4.10` |

If you manually create a higher semver tag, future deploys continue patch bumps from that latest tag.

List deployment tags:

```bash
git tag -l 'v*' --sort=-v:refname
```

### Inputs, Secrets, and Repo Variables

Reusable workflow interface:

| Workflow | Inputs | Required secrets |
|----------|--------|------------------|
| Lint GitHub Actions | None | None |
| Build Static Site | `app_url`, `artifact_name` (default `dist`), `aws_region` | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` |
| Lighthouse Static Site | `artifact_name` (default `dist`) | None |
| Deploy Static Site | `artifact_name` (default `dist`), `aws_region`, `cdk_stack_name`, `tag_prefix` (default `v`) | `AWS_DEPLOY_ROLE_ARN` |

Repo-level values used by the live pipeline:

| Kind | Name | Required | Used by | Purpose |
|------|------|----------|---------|---------|
| Secret | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Yes | Build | Cloudinary cloud name embedded into the static site |
| Secret | `AWS_DEPLOY_ROLE_ARN` | Yes | Deploy | IAM role ARN used for GitHub OIDC authentication |
| Variable | `AWS_REGION` | Yes | Build, Deploy | Shared AWS region used by the reusable workflows |
| Variable | `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` | No | Build | Optional Cloudflare Web Analytics token |
| Variable | `NEXT_PUBLIC_CW_RUM_APP_MONITOR_ID` | No | Build | Optional CloudWatch RUM App Monitor ID |
| Variable | `NEXT_PUBLIC_CW_RUM_IDENTITY_POOL_ID` | No | Build | Optional CloudWatch RUM Cognito Identity Pool ID |
| Variable | `NEXT_PUBLIC_SENTRY_DSN` | No | Build | Optional Sentry DSN |

Environment validation in the app:

- [`src/clientEnv.ts`](../src/clientEnv.ts) validates the `NEXT_PUBLIC_*` values used by the app.
- [`src/buildEnv.ts`](../src/buildEnv.ts) currently defines only `AWS_REGION` and requires it explicitly if the module is imported into future build-time code.

### First Infrastructure Deploy

The GitHub Actions pipeline deploys static assets only. The first `cdk deploy` stays manual and is documented here:

- Runbook: [`../infrastructure/INITIAL_DEPLOYMENT.md`](../infrastructure/INITIAL_DEPLOYMENT.md)
- Helper script: [`../scripts/initial-aws-deploy.sh`](../scripts/initial-aws-deploy.sh)
- Additional local env required for the first infrastructure deploy:
  - `AWS_REGION`
  - `CLOUDFRONT_CERTIFICATE_REGION`

### Unused Repo-Local Helpers

These files exist in the repo but are not used by the current workflows:

| Helper | File | Notes |
|--------|------|-------|
| Setup Node.js and PNPM | [`./actions/setup-node-pnpm/action.yml`](./actions/setup-node-pnpm/action.yml) | Current workflows call `pnpm/action-setup@v4` and `actions/setup-node@v6` directly |
| Tag deployment | [`./actions/tag-deployment/action.yml`](./actions/tag-deployment/action.yml) | Supports configurable semver bumps, but the live deploy workflow performs an inline patch bump instead |

### Local Tooling

To match the CI lint job locally, install `actionlint` once on your machine and run it from repo root:

```bash
brew install actionlint
actionlint
```

Pinned Go install alternative:

```bash
go install github.com/rhysd/actionlint/cmd/actionlint@v1.7.11
actionlint
```
