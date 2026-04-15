# Initial AWS Deployment

This runbook is for the first production deployment of `benjamin-chavez.com` to the AWS stack in this repo.

You run the commands yourself. The checked-in helper script is [../scripts/initial-aws-deploy.sh](../scripts/initial-aws-deploy.sh).

For routine deploys after the initial setup, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Scope

- Deploy the three-stack CDK infrastructure (HostedZone, Certificate, StaticSite)
- Delegate DNS from the domain registrar to Route 53 during the deploy
- Build and publish the static site to S3
- Invalidate CloudFront
- Verify the live site

Deferred for later:

- Cloudflare Web Analytics
- Sentry
- CloudWatch RUM

## Architecture Overview

The infrastructure is split into three CloudFormation stacks:

| Stack | Region | Resources |
|---|---|---|
| `BenjaminChavezCom-Prod-HostedZone` | us-east-1 | Route 53 public hosted zone |
| `BenjaminChavezCom-Prod-Certificate` | us-east-1 | ACM certificate (DNS-validated against the hosted zone) |
| `BenjaminChavezCom-Prod` | us-east-2 | S3 bucket, CloudFront distribution, Route 53 A/AAAA alias records |

The HostedZone and Certificate stacks live in `us-east-1` because CloudFront requires its ACM certificate in that region. The site stack lives in `us-east-2`.

## Prerequisites

- Node.js `24.x`
- PNPM `10.x`
- AWS CLI authenticated against the target account
- `jq`
- `dig`
- `gh` if you want to set GitHub secrets from the terminal

Required environment variables before the first infrastructure deploy:

```bash
export AWS_REGION=us-east-2
export CLOUDFRONT_CERTIFICATE_REGION=us-east-1
```

`AWS_REGION` is the deployment region for the site stack and site assets. `CLOUDFRONT_CERTIFICATE_REGION` is separate because CloudFront viewer certificates must be created in `us-east-1`.

## Why The Regions Do Not Match

This repo intentionally uses two AWS regions during infrastructure deployment:

- `AWS_REGION=us-east-2` — site stack region (S3, CloudFront distribution, Route 53 alias records)
- `CLOUDFRONT_CERTIFICATE_REGION=us-east-1` — HostedZone and Certificate stack region (Route 53 hosted zone, ACM certificate)

This split is required by AWS. CloudFront is a global service, but ACM certificates attached to CloudFront distributions must be created in `us-east-1`. That means the site stack can live in `us-east-2` while the CloudFront viewer certificate still has to be provisioned in `us-east-1`.

Do not change `CLOUDFRONT_CERTIFICATE_REGION` to `us-east-2` unless you also change away from using an ACM certificate on CloudFront.

Optional but supported overrides:

```bash
export CDK_DEFAULT_REGION="$AWS_REGION"
export CDK_DEFAULT_ACCOUNT="$(aws sts get-caller-identity --query Account --output text)"
```

## GitHub Configuration

Required GitHub secrets:

- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` — Cloudinary cloud name used in the static build
- `AWS_DEPLOY_ROLE_ARN` — IAM role ARN for GitHub OIDC deployment

Required GitHub Actions repo variables:

- `AWS_REGION` — AWS region for build and deploy
- `CDK_STACK_NAME` — CloudFormation stack name for deploy outputs (e.g. `BenjaminChavezCom-Prod`)
- `APP_URL` — Public site URL embedded in the build output (e.g. `https://benjamin-chavez.com`)

Optional GitHub repo variables (deferred):

- `NEXT_PUBLIC_CF_ANALYTICS_TOKEN`
- `NEXT_PUBLIC_CW_RUM_APP_MONITOR_ID`
- `NEXT_PUBLIC_CW_RUM_IDENTITY_POOL_ID`
- `NEXT_PUBLIC_SENTRY_DSN`

Example commands:

```bash
gh secret set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME --body "<cloudinary-cloud-name>"
gh secret set AWS_DEPLOY_ROLE_ARN --body "arn:aws:iam::<account-id>:role/<github-oidc-deploy-role>"
gh variable set AWS_REGION --body "$AWS_REGION"
gh variable set CDK_STACK_NAME --body "BenjaminChavezCom-Prod"
gh variable set APP_URL --body "https://benjamin-chavez.com"
```

## Prepare `.env.local`

Create `.env.local` if it does not exist and set at least:

```dotenv
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<cloudinary-cloud-name>
NEXT_PUBLIC_APP_URL=https://benjamin-chavez.com
```

The helper script validates that `.env.local` exists before it runs. It derives `NEXT_PUBLIC_AWS_REGION` from your exported `AWS_REGION`, so the region does not need to be hardcoded in `.env.local`.

## First Deployment Flow

1. Run the preflight checks:

```bash
scripts/initial-aws-deploy.sh --check
```

2. Run the initial deploy when the checks are clean:

```bash
scripts/initial-aws-deploy.sh --apply
```

The script executes the following phases in order:

1. **Preflight** — validates required commands (`aws`, `jq`, `pnpm`, `dig`), environment variables (`AWS_REGION`, `CLOUDFRONT_CERTIFICATE_REGION`), and `.env.local` values (`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_APP_URL`)
2. **Install dependencies** — runs `pnpm --dir infrastructure install --frozen-lockfile` if infrastructure deps are not already present
3. **CDK diff** — runs `pnpm --dir infrastructure run diff` to show pending changes (in `--check` mode the script exits here)
4. **Bootstrap CDK** — bootstraps both `us-east-2` and `us-east-1`
5. **Deploy HostedZone stack** (`us-east-1`) — creates the Route 53 public hosted zone
6. **Read HostedZone outputs** — retrieves the assigned Route 53 nameservers
7. **Registrar update (manual)** — prints the nameservers and pauses, prompting you to update your GoDaddy nameservers to the Route 53 values shown
8. **DNS delegation check** — polls `dig NS` every 30 seconds until the public nameservers match the expected Route 53 values (up to 60 attempts / ~30 minutes, then offers to keep waiting)
9. **Deploy Certificate stack** (`us-east-1`) — creates the ACM certificate with DNS validation; validation succeeds automatically because the hosted zone is already delegated
10. **Deploy site stack** (`us-east-2`) — creates the S3 bucket, CloudFront distribution, and Route 53 alias records for apex and www
11. **Build** — runs `pnpm build` to produce the static export in `dist/`
12. **Publish** — syncs `dist/` to S3 and invalidates CloudFront
13. **Done** — prints the bucket name, distribution ID, and distribution domain

> **Note:** The script will pause after deploying the HostedZone stack and prompt you to update your registrar nameservers before continuing. Certificate validation typically takes 5-30 minutes after nameserver propagation.

## Post-Deployment Verification

After the script completes, verify the site is working:

- Homepage loads
- Blog pages render
- Redirects work
- Static assets load
- HTTPS works on both apex and www

Verify the CloudFront distribution domain (printed by the script):

```bash
curl -I "https://<distribution-domain>"
```

Verify the production domains:

```bash
curl -I "https://benjamin-chavez.com"
curl -I "https://benjamin-chavez.com/blog/"
curl -I "https://www.benjamin-chavez.com"
dig NS benjamin-chavez.com
```

## Rollback Notes

- If the site content is wrong but infrastructure is healthy, rebuild and re-run the publish flow.
- The Route 53 hosted zone and apex/www alias records are retained by the stack to reduce accidental DNS loss during stack deletion or replacement.
- Bucket contents are also retained.

## Roadmap

- [x] Deploy three-stack CDK infrastructure
- [x] DNS cutover from Vercel to Route 53
- [ ] Configure and enable Cloudflare Web Analytics
- [ ] Configure and enable Sentry browser instrumentation
- [ ] Configure and enable CloudWatch RUM
