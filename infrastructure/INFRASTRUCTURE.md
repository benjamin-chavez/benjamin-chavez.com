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
| [`lib/stacks/static-site-stack.ts`](lib/stacks/static-site-stack.ts) | Main infrastructure stack                     |
| [`lib/constructs/`](lib/constructs)                                  | Reusable CDK constructs for the static site   |
| [`lib/config/`](lib/config)                                          | Shared infrastructure configuration and types |
| [`edge/`](edge)                                                      | CloudFront edge handler sources               |
| [`assets/cloudfront/`](assets/cloudfront)                            | Static routing and CloudFront asset inputs    |

## Related Docs

- [Root README](../README.md) for app development and root-level commands
- [`.github/CI-CD.md`](../.github/CI-CD.md) for the GitHub Actions deployment pipeline
