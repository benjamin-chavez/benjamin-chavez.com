# Infrastructure

This package contains the AWS CDK app and edge runtime code that provision and support the static site deployment for
`benjamin-chavez.com`.

## Working In This Package

Run commands from the repo root with `pnpm --dir infrastructure run <script>`, or change into this directory and run
`pnpm run <script>` there.

## Commands
 
| Command                                       | Purpose                                                               |
|-----------------------------------------------|-----------------------------------------------------------------------|
| `pnpm --dir infrastructure run build`         | Compiles the edge handler and the infrastructure TypeScript sources   |
| `pnpm --dir infrastructure run build:edge`    | Compiles `edge/**/*.ts` into `dist/cloudfront/`                       |
| `pnpm --dir infrastructure run synth`         | Rebuilds the edge handler and synthesizes the CloudFormation template |
| `pnpm --dir infrastructure run diff`          | Rebuilds the edge handler and shows the CloudFormation diff           |
| `pnpm --dir infrastructure run deploy`        | Rebuilds the edge handler and runs `cdk deploy`                       |
| `pnpm --dir infrastructure run cdk -- <args>` | Runs the CDK CLI directly for package-local commands                  |

## Package Layout

| Path                                                                 | Purpose                                       |
|----------------------------------------------------------------------|-----------------------------------------------|
| [`bin/app.ts`](bin/app.ts)                                           | CDK app entrypoint                            |
| [`lib/stacks/hosted-zone-stack.ts`](lib/stacks/hosted-zone-stack.ts) | Route 53 hosted zone                          |
| [`lib/stacks/certificate-stack.ts`](lib/stacks/certificate-stack.ts) | ACM certificate (DNS-validated)               |
| [`lib/stacks/static-site-stack.ts`](lib/stacks/static-site-stack.ts) | S3, CloudFront, DNS alias records             |
| [`lib/constructs/`](lib/constructs)                                  | Reusable CDK constructs for the static site   |
| [`lib/config/`](lib/config)                                          | Shared infrastructure configuration and types |
| [`edge/`](edge)                                                      | CloudFront edge handler sources               |
| [`assets/cloudfront/`](assets/cloudfront)                            | Static routing and CloudFront asset inputs    |

## Related Docs

- [Root README](../README.md) for app development and root-level commands
- [`.github/CI-CD.md`](../.github/CI-CD.md) for the GitHub Actions deployment pipeline
- [`INITIAL_DEPLOYMENT.md`](INITIAL_DEPLOYMENT.md) for the first manual AWS deployment runbook
- [`DEPLOYMENT.md`](DEPLOYMENT.md) for the routine deployment workflow
- [`../scripts/initial-aws-deploy.sh`](../scripts/initial-aws-deploy.sh) for the user-run helper script

## Region Notes

The deployment uses two AWS regions on purpose:

- `AWS_REGION` is your main stack region and is currently intended to be `us-east-2`
- `CLOUDFRONT_CERTIFICATE_REGION` must remain `us-east-1` for the ACM certificate attached to CloudFront

CloudFront viewer certificates cannot use an ACM certificate from `us-east-2`.
