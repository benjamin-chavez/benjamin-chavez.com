[//]: # (.github/CI-CD.md)

## CI/CD & Automation

This project uses GitHub Actions to build, validate, and deploy a static Next.js site to AWS (S3 + CloudFront).

### Workflow Layout

| Workflow | File | Trigger | Purpose |
|----------|------|---------|---------|
| CI | [`ci.yml`](workflows/ci.yml) | Push, pull request, manual dispatch | Orchestrates build, Lighthouse, and gated deploy |
| Build Static Site | [`build-static-site.yml`](workflows/build-static-site.yml) | `workflow_call` | Builds the site and uploads the deployable artifact |
| Lighthouse Static Site | [`lighthouse-static-site.yml`](workflows/lighthouse-static-site.yml) | `workflow_call` | Runs Lighthouse against the uploaded build artifact |
| Deploy Static Site | [`deploy-static-site.yml`](workflows/deploy-static-site.yml) | `workflow_call` | Downloads the artifact, deploys to AWS, invalidates CloudFront, and tags the release |

### CI Flow

The top-level CI workflow builds once, validates that exact artifact with Lighthouse, and only then deploys it on `master`.

| Job | Description |
|-----|-------------|
| Build | Installs dependencies, runs `pnpm build`, and uploads `dist/` as an artifact |
| Lighthouse | Downloads the `dist/` artifact and runs `npx @lhci/cli autorun` |
| Deploy | Downloads the same `dist/` artifact, syncs it to S3, invalidates CloudFront, and creates a semver deployment tag |

### Reuse Across Repos

The reusable workflows in `.github/workflows/` are designed to be called by another repo with the same stack. The caller should:

1. Standardize on the same GitHub secret and variable names.
2. Pass repo-specific values such as `app_url` and `cdk_stack_name` as workflow inputs.
3. Pin external reusable workflow references to a commit SHA when another repo starts calling them.

### Deployment Behavior

Deploy runs only after both Build and Lighthouse succeed.

| Step | Description |
|------|-------------|
| Configure AWS | OIDC authentication via `AWS_DEPLOY_ROLE_ARN` |
| Read CDK stack outputs | Fetches the S3 bucket name and CloudFront distribution ID from CloudFormation |
| Sync to S3 | `aws s3 sync dist/ s3://<bucket> --delete` |
| Invalidate CloudFront | Creates a `/*` invalidation |
| Tag deployment | Auto-increments the semver patch version on successful deploy |

### Versioning

Deployments are tagged with semver versions that auto-increment on each successful deploy.

| Action | Example |
|--------|---------|
| Automatic (every deploy) | `v1.0.0` -> `v1.0.1` -> `v1.0.2` |
| Manual minor bump | `git tag v1.1.0 && git push origin v1.1.0` |
| Manual major bump | `git tag v2.0.0 && git push origin v2.0.0` |

List all deployment versions:

```bash
git tag -l 'v*' --sort=-v:refname
```

### Required Secrets & Variables

#### Secrets

| Secret | Required | Purpose |
|--------|----------|---------|
| `AWS_DEPLOY_ROLE_ARN` | Yes | IAM role ARN for GitHub OIDC authentication |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name embedded in the static build |

#### Variables / Environment

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `AWS_REGION` | No | `us-east-2` | AWS region for deployment and public client config |
| `NEXT_PUBLIC_APP_URL` | No | `http://localhost:3000` | Site URL embedded in static output |
| `NEXT_PUBLIC_AWS_REGION` | No | `us-east-2` | AWS region exposed to the client |
| `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` | No | — | Cloudflare Web Analytics token |
| `NEXT_PUBLIC_CW_RUM_APP_MONITOR_ID` | No | — | CloudWatch RUM App Monitor ID |
| `NEXT_PUBLIC_CW_RUM_IDENTITY_POOL_ID` | No | — | CloudWatch RUM Cognito Identity Pool ID |
| `NEXT_PUBLIC_SENTRY_DSN` | No | — | Sentry DSN |

Environment variable schemas are validated at build time by [`src/buildEnv.ts`](../src/buildEnv.ts) and [`src/clientEnv.ts`](../src/clientEnv.ts).
