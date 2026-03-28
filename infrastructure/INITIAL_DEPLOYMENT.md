# Initial AWS Deployment

This runbook is for the first production deployment of `benjamin-chavez.com` to the AWS stack in this repo.

You run the commands yourself. The checked-in helper script is [../scripts/initial-aws-deploy.sh](../scripts/initial-aws-deploy.sh).

## Scope

- Deploy the CDK infrastructure
- Build and publish the static site to S3
- Invalidate CloudFront
- Verify the CloudFront-backed site
- Stage the DNS cutover from Vercel to Route 53

Deferred for later:

- Cloudflare Web Analytics
- Sentry
- CloudWatch RUM

## Prerequisites

- Node.js `24.x`
- PNPM `10.x`
- AWS CLI authenticated against the target account
- `jq`
- `gh` if you want to set GitHub secrets from the terminal

Required environment variables before the first infrastructure deploy:

```bash
export AWS_REGION=us-east-2
export CLOUDFRONT_CERTIFICATE_REGION=us-east-1
```

`AWS_REGION` is the deployment region for the stack and site assets. `CLOUDFRONT_CERTIFICATE_REGION` is separate because CloudFront viewer certificates must be created in `us-east-1`.

Optional but supported overrides:

```bash
export CDK_DEFAULT_REGION="$AWS_REGION"
export CDK_DEFAULT_ACCOUNT="$(aws sts get-caller-identity --query Account --output text)"
```

## GitHub Configuration

Required GitHub secret:

- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`

Required GitHub Actions secret for static deploys:

- `AWS_DEPLOY_ROLE_ARN`

Required GitHub Actions repo variable:

- `AWS_REGION`

Deferred GitHub variables:

- `NEXT_PUBLIC_CF_ANALYTICS_TOKEN`
- `NEXT_PUBLIC_CW_RUM_APP_MONITOR_ID`
- `NEXT_PUBLIC_CW_RUM_IDENTITY_POOL_ID`
- `NEXT_PUBLIC_SENTRY_DSN`

Example commands:

```bash
gh secret set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME --body "<cloudinary-cloud-name>"
gh secret set AWS_DEPLOY_ROLE_ARN --body "arn:aws:iam::<account-id>:role/<github-oidc-deploy-role>"
gh variable set AWS_REGION --body "$AWS_REGION"
```

## Prepare `.env.local`

Create `.env.local` if it does not exist and set at least:

```dotenv
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<cloudinary-cloud-name>
NEXT_PUBLIC_APP_URL=https://benjamin-chavez.com
NEXT_PUBLIC_AWS_REGION=us-east-2
AWS_REGION=us-east-2
```

The helper script validates that `.env.local` exists before it runs.

## First Deployment Flow

1. Run the preflight checks:

```bash
scripts/initial-aws-deploy.sh --check
```

2. Run the initial deploy when the checks are clean:

```bash
scripts/initial-aws-deploy.sh --apply
```

The script will:

- install infrastructure dependencies if needed
- bootstrap CDK
- deploy the infrastructure stack
- build the site with `pnpm build`
- sync `dist/` to S3
- invalidate CloudFront
- print the CloudFront domain, stack outputs, and Route 53 nameservers

## Verify Before DNS Cutover

Verify the site on the CloudFront distribution domain that the script prints:

- homepage loads
- blog pages render
- redirects work
- static assets load
- HTTPS works

Useful checks:

```bash
curl -I "https://<distribution-domain>"
curl -I "https://<distribution-domain>/blog/"
```

## DNS Cutover From Vercel

Once the CloudFront domain looks correct:

1. Get the Route 53 nameservers from the script output or CloudFormation output.
2. Update the registrar to use those Route 53 nameservers.
3. Wait for nameserver propagation.
4. Confirm production resolves to the Route 53 hosted zone:

```bash
dig NS benjamin-chavez.com
curl -I https://benjamin-chavez.com
```

5. After production is stable on AWS, remove or disable the Vercel production domain mapping.

## Rollback Notes

- If the site content is wrong but infrastructure is healthy, rebuild and re-run the publish flow.
- Route 53 hosted zone and apex/www alias records are retained by the stack to reduce accidental DNS loss during stack deletion or replacement.
- Bucket contents are also retained.

## Roadmap

- Add Cloudflare Web Analytics once the AWS-hosted site is stable.
- Add minimal Sentry browser instrumentation after production verification.
- Add CloudWatch RUM after the app monitor and identity pool are provisioned.
