# Deployment

This document covers routine deployments of `benjamin-chavez.com` after the infrastructure is already provisioned. For
first-time setup, see [`INITIAL_DEPLOYMENT.md`](INITIAL_DEPLOYMENT.md).

There are two independent deployment paths:

- **Content deploy** — rebuilds the static site and syncs it to S3. This is what CI does on every push to `master`.
- **Infrastructure deploy** — updates the CDK stacks (S3, CloudFront, Route 53, ACM, edge functions). Always manual.

Most changes are content-only. Infrastructure deploys are only needed when you modify files under `infrastructure/`.

## CI/CD (Automatic)

Pushing to `master` (direct push, merged PR, or manual `workflow_dispatch`) triggers the CI pipeline. The pipeline
runs actionlint, builds the site, runs Lighthouse audits, and — if all pass — deploys the static assets to S3 and
invalidates CloudFront. Each successful deploy creates a semver patch tag (e.g., `v1.0.1`).

No manual steps are required for content-only changes that go through CI. The CI pipeline does **not** run `cdk deploy`
or update infrastructure.

See [`.github/CI-CD.md`](../.github/CI-CD.md) for full pipeline details.

## Read Stack Outputs

Manual content and infrastructure deploys both need the S3 bucket name and CloudFront distribution ID. Read them from
CloudFormation rather than hardcoding — the distribution ID changes if the resource is ever recreated:

```bash
aws cloudformation describe-stacks \
  --stack-name BenjaminChavezCom-Prod \
  --region us-east-2 \
  --query 'Stacks[0].Outputs' --output table
```

The relevant output keys are `BucketName` and `DistributionId`.

To capture them as shell variables:

```bash
OUTPUTS=$(aws cloudformation describe-stacks \
  --stack-name BenjaminChavezCom-Prod \
  --region us-east-2 \
  --query 'Stacks[0].Outputs' --output json)

BUCKET=$(echo "$OUTPUTS" | jq -r '.[] | select(.OutputKey=="BucketName") | .OutputValue')
DIST_ID=$(echo "$OUTPUTS" | jq -r '.[] | select(.OutputKey=="DistributionId") | .OutputValue')
```

## Manual Content Deploy

Use this when you need to deploy content outside of CI (e.g., hotfix, local build verification).

### Prerequisites

- Node.js `24.x`
- PNPM `10.x`
- AWS CLI authenticated against the target account (region `us-east-2`)
- `jq` (for reading stack outputs)
- `.env.local` with at least:

```dotenv
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<cloudinary-cloud-name>
NEXT_PUBLIC_APP_URL=https://benjamin-chavez.com
```

### Steps

1. Read the deploy targets (see [Read Stack Outputs](#read-stack-outputs)):

```bash
OUTPUTS=$(aws cloudformation describe-stacks \
  --stack-name BenjaminChavezCom-Prod \
  --region us-east-2 \
  --query 'Stacks[0].Outputs' --output json)

BUCKET=$(echo "$OUTPUTS" | jq -r '.[] | select(.OutputKey=="BucketName") | .OutputValue')
DIST_ID=$(echo "$OUTPUTS" | jq -r '.[] | select(.OutputKey=="DistributionId") | .OutputValue')
```

2. Build the static site:

```bash
pnpm build
```

This runs OG image generation and the Next.js static export into `dist/`.

3. Sync to S3:

```bash
aws s3 sync dist/ "s3://$BUCKET" --delete
```

This uploads `dist/` to the S3 bucket and `--delete` removes any files in S3 that no longer exist locally, ensuring the bucket is an exact mirror of the build output.

4. Invalidate CloudFront:

```bash
aws cloudfront create-invalidation \
  --distribution-id "$DIST_ID" \
  --paths "/*"
```

## Infrastructure Deploy

Use this when you have changed files under `infrastructure/` (stacks, constructs, edge handlers, CDK config).

### Prerequisites

Everything from the content deploy prerequisites, plus:

```bash
export AWS_REGION=us-east-2
export CLOUDFRONT_CERTIFICATE_REGION=us-east-1
```

### Steps

1. Preview the changes:

```bash
pnpm --dir infrastructure run diff
```

Review the CloudFormation diff carefully before proceeding.

2. Deploy all stacks:

```bash
pnpm --dir infrastructure run deploy
```

This compiles the edge handler, synthesizes the templates, and runs `cdk deploy`. All three stacks deploy in
dependency order:

| Stack | Region | Resources |
|-------|--------|-----------|
| `BenjaminChavezCom-Prod-HostedZone` | `us-east-1` | Route 53 hosted zone |
| `BenjaminChavezCom-Prod-Certificate` | `us-east-1` | ACM certificate (DNS-validated) |
| `BenjaminChavezCom-Prod` | `us-east-2` | S3 bucket, CloudFront distribution, Route 53 alias records |

> **Note:** CDK will prompt for approval if there are security-sensitive changes (IAM, security groups). Pass
> `--require-approval never` only if you have already reviewed the diff.

To deploy a single stack instead of all three:

```bash
pnpm --dir infrastructure exec cdk deploy BenjaminChavezCom-Prod
```

## Full Deploy (Infrastructure + Content)

When both infrastructure and content have changed:

1. Export the environment variables:

```bash
export AWS_REGION=us-east-2
export CLOUDFRONT_CERTIFICATE_REGION=us-east-1
```

2. Deploy infrastructure:

```bash
pnpm --dir infrastructure run deploy
```

3. Build and publish content (see [Manual Content Deploy](#manual-content-deploy) for the full sequence):

```bash
OUTPUTS=$(aws cloudformation describe-stacks \
  --stack-name BenjaminChavezCom-Prod \
  --region us-east-2 \
  --query 'Stacks[0].Outputs' --output json)

BUCKET=$(echo "$OUTPUTS" | jq -r '.[] | select(.OutputKey=="BucketName") | .OutputValue')
DIST_ID=$(echo "$OUTPUTS" | jq -r '.[] | select(.OutputKey=="DistributionId") | .OutputValue')

pnpm build
aws s3 sync dist/ "s3://$BUCKET" --delete
aws cloudfront create-invalidation \
  --distribution-id "$DIST_ID" \
  --paths "/*"
```

## Preview Before Deploying

### Local dev server

```bash
pnpm dev
```

Opens the dev server at `http://localhost:3000`.

### Build output inspection

```bash
pnpm build
```

Inspect the generated files in `dist/`. There is no staging environment.

### Infrastructure diff

```bash
export AWS_REGION=us-east-2
export CLOUDFRONT_CERTIFICATE_REGION=us-east-1
pnpm --dir infrastructure run diff
```

Shows the CloudFormation diff without deploying.

## Rollback

There is no one-click rollback mechanism.

### Content rollback

Rebuild from a known-good commit and re-publish:

```bash
git checkout <good-commit>
pnpm build

OUTPUTS=$(aws cloudformation describe-stacks \
  --stack-name BenjaminChavezCom-Prod \
  --region us-east-2 \
  --query 'Stacks[0].Outputs' --output json)

BUCKET=$(echo "$OUTPUTS" | jq -r '.[] | select(.OutputKey=="BucketName") | .OutputValue')
DIST_ID=$(echo "$OUTPUTS" | jq -r '.[] | select(.OutputKey=="DistributionId") | .OutputValue')

aws s3 sync dist/ "s3://$BUCKET" --delete
aws cloudfront create-invalidation \
  --distribution-id "$DIST_ID" \
  --paths "/*"
```

### Infrastructure rollback

CloudFormation automatically rolls back failed stack updates. To revert a successful infrastructure deploy, check out
the previous commit and re-run `pnpm --dir infrastructure run deploy`.

Route 53 hosted zone records and the S3 bucket have `RETAIN` removal policies, so accidental stack deletion will not
destroy DNS records or site content.

## Deployment Tags

CI creates a semver patch tag (e.g., `v1.0.1`) on each successful deploy. Only the patch version is bumped
automatically. List deployment tags:

```bash
git tag -l 'v*' --sort=-v:refname
```

## Related Docs

- [`INITIAL_DEPLOYMENT.md`](INITIAL_DEPLOYMENT.md) — first-time AWS setup and DNS cutover
- [`INFRASTRUCTURE.md`](INFRASTRUCTURE.md) — CDK package layout and commands
- [`.github/CI-CD.md`](../.github/CI-CD.md) — GitHub Actions pipeline details
