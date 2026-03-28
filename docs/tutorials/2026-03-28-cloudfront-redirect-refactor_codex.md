# Refactoring CloudFront Redirects in AWS CDK: A Step-by-Step Tutorial

> **What you'll build:** A file-backed CloudFront viewer-request function that reads redirects from a CloudFront KeyValueStore, preserves query strings, and serves both the apex domain and `www`.
>
> **What you'll learn:**
> - Why separating CloudFront Function code from redirect data makes the stack easier to maintain
> - How to store redirects in a CloudFront KeyValueStore
> - How to preserve query strings when returning redirects from a viewer-request function
> - How to wire file-based CloudFront assets into a CDK construct
> - How to fix Route 53 records so `www` resolves alongside the apex domain
>
> **Prerequisites:** You should be comfortable reading TypeScript, running `pnpm` commands, and making small changes to an AWS CDK stack.
>
> **Estimated time:** 45-60 minutes

---

## Table of Contents

- [Introduction](#introduction)
- [Step 1: Move the viewer-request logic into a real file](#step-1-move-the-viewer-request-logic-into-a-real-file)
- [Step 2: Move redirect data into a KeyValueStore import file](#step-2-move-redirect-data-into-a-keyvaluestore-import-file)
- [Step 3: Update the CDK construct to use file-backed assets](#step-3-update-the-cdk-construct-to-use-file-backed-assets)
- [Step 4: Simplify the stack entrypoint](#step-4-simplify-the-stack-entrypoint)
- [Step 5: Verify the refactor before you deploy](#step-5-verify-the-refactor-before-you-deploy)
- [Wrapping Up](#wrapping-up)

---

## Introduction

Right now, your stack builds CloudFront Function source code by concatenating JavaScript inside TypeScript. That works for a very small redirect map, but it mixes two different concerns that change at different speeds: executable behavior and redirect content. The function logic itself is stable. The redirect list is data. When both are generated inline, every small redirect change becomes a code-generation change, which is harder to review and easier to break.

In this tutorial, you'll split those concerns cleanly. You'll move the viewer-request function into its own file, put the redirects into a CloudFront KeyValueStore import file, and teach the function to read redirects from that store. While you're touching the function, you'll also fix a real behavior gap: preserving query strings during redirects.

You'll finish with an infrastructure setup that is easier to read, easier to extend, and closer to how edge configuration is usually modeled in production: code in one place, data in another.

---

## Step 1: Move the viewer-request logic into a real file

### What we're doing and why

The first goal is to stop generating JavaScript source code from TypeScript strings. A CloudFront Function is still just JavaScript at the end of the day, so the cleanest place for that code is a standalone file that you can read, diff, and test on its own.

We're also going to improve the handler while we're here. Instead of embedding redirects directly in the function, we'll prepare the handler to read redirect targets from a CloudFront KeyValueStore. That lets you update redirect data without rebuilding the function body itself.

### Instructions

1. Create a dedicated directory for CloudFront assets inside the infrastructure package.

```bash
mkdir -p infrastructure/cloudfront
```

| Part | What it does |
|------|-------------|
| `mkdir` | Creates directories on disk |
| `-p` | Creates parent directories as needed and does not fail if they already exist |
| `infrastructure/cloudfront` | The folder where you'll keep the CloudFront function and redirect data files |

2. Add a new handler file.

**File: `infrastructure/cloudfront/viewer-request.js`**

```javascript
import cf from 'cloudfront';

const kvs = cf.kvs();

function hasFileExtension(uri) {
  const lastSegment = uri.split('/').pop() || '';
  return lastSegment.includes('.');
}

function serializeQuerystring(querystring) {
  const parts = [];

  for (const key in querystring) {
    if (!Object.prototype.hasOwnProperty.call(querystring, key)) {
      continue;
    }

    const entry = querystring[key];
    const values = entry.multiValue && entry.multiValue.length > 0
      ? entry.multiValue
      : [entry];

    for (let index = 0; index < values.length; index += 1) {
      const value = values[index].value;
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  }

  return parts.join('&');
}

function buildRedirectLocation(destination, querystring) {
  const serializedQuery = serializeQuerystring(querystring);

  if (!serializedQuery) {
    return destination;
  }

  const separator = destination.includes('?') ? '&' : '?';
  return `${destination}${separator}${serializedQuery}`;
}

export async function handler(event) {
  const request = event.request;
  const uri = request.uri;

  try {
    const redirectTarget = await kvs.get(uri);

    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: {
        location: {
          value: buildRedirectLocation(redirectTarget, request.querystring),
        },
      },
    };
  } catch (error) {
    // A missing key just means this request is not a redirect.
  }

  if (uri.endsWith('/')) {
    request.uri += 'index.html';
  } else if (!hasFileExtension(uri)) {
    request.uri += '/index.html';
  }

  return request;
}
```

> **Common mistake:** Don't keep the old `redirects` object hard-coded in this file "just for now." That leaves you with the same coupling problem in a different place. The point of this refactor is to keep behavior static and move redirect content into data.

### Command breakdown

You already created the directory with:

```bash
mkdir -p infrastructure/cloudfront
```

| Part | What it does |
|------|-------------|
| `mkdir` | Creates directories |
| `-p` | Creates missing parents and makes the command safe to rerun |
| `infrastructure/cloudfront` | The destination folder for the new handler file |

### Checkpoint

At the end of this step, you should have a new file at `infrastructure/cloudfront/viewer-request.js`. The file should:

- import `cloudfront`
- call `cf.kvs()`
- return a `301` redirect when a key is found
- preserve query strings
- still rewrite clean URLs to `index.html`

---

## Step 2: Move redirect data into a KeyValueStore import file

### What we're doing and why

Now that the function code is static, we need a new home for the redirect map. CloudFront KeyValueStore is a good fit because it is designed for exactly this kind of small edge lookup data: redirects, feature flags, authorization rules, and other request-time configuration.

The important idea here is that the function no longer needs to know every redirect at build time. It only needs a key to look up. That makes the function smaller and easier to reason about.

### Instructions

1. Create the import file that CloudFront KeyValueStore expects.

**File: `infrastructure/cloudfront/redirects.json`**

```json
{
  "data": [
    {
      "key": "/blog/step-by-step-guide-setting-up-expressjs-typescript-web-app",
      "value": "/blog/creating-a-typescript-express.js-web-application-with-es6-step-by-step-guide/"
    },
    {
      "key": "/downloads/epay-mailer",
      "value": "/downloads/Estimated%20Tax%20Payment%20Mailer.zip"
    }
  ]
}
```

2. Keep using the request path as the key and the destination URL as the value. That keeps the lookup logic in your function simple: `await kvs.get(uri)`.

> **Common mistake:** The import file format is not a plain JSON object. CloudFront KeyValueStore expects a top-level `data` array with `{ "key": "...", "value": "..." }` entries.

### Command breakdown

There isn't a required terminal command in this step if you're editing the file in your editor, so the important thing to verify is the JSON shape itself.

### Checkpoint

At the end of this step, `infrastructure/cloudfront/redirects.json` should contain a `data` array, and each redirect should be represented as one object with exactly two fields:

- `key`
- `value`

---

## Step 3: Update the CDK construct to use file-backed assets

### What we're doing and why

This is the step where everything gets wired together. The construct will stop generating CloudFront Function code inline, start loading the function from `viewer-request.js`, and create a CloudFront KeyValueStore from `redirects.json`.

We'll also fix the missing `www` Route 53 records here. Your current construct provisions a certificate and distribution aliases for both the apex domain and `www`, but only creates DNS records for the apex domain. That means `www` is configured in CloudFront without actually resolving in Route 53.

### Instructions

1. Add `path` to the imports and remove the `redirects` prop from `StaticSiteProps`.

**File: `infrastructure/lib/static-site-construct.ts`**

```diff
import * as path from 'path';

export interface StaticSiteProps {
  domainName: string;
-  redirects?: Record<string, string>;
}
```

2. Replace the inline function generation with file-backed assets and a KeyValueStore.

**File: `infrastructure/lib/static-site-construct.ts`**

```typescript
import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';

export interface StaticSiteProps {
  domainName: string;
}

export class StaticSiteConstruct extends Construct {
  public readonly bucket: s3.Bucket;
  public readonly distribution: cloudfront.Distribution;
  public readonly hostedZone: route53.PublicHostedZone;

  constructor(scope: Construct, id: string, props: StaticSiteProps) {
    super(scope, id);

    const viewerRequestFunctionPath = path.join(
      process.cwd(),
      'cloudfront',
      'viewer-request.js',
    );
    const redirectsPath = path.join(
      process.cwd(),
      'cloudfront',
      'redirects.json',
    );

    this.bucket = new s3.Bucket(this, 'SiteBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      encryption: s3.BucketEncryption.S3_MANAGED,
    });

    this.hostedZone = new route53.PublicHostedZone(this, 'HostedZone', {
      zoneName: props.domainName,
    });

    const certificate = new acm.Certificate(this, 'Certificate', {
      domainName: props.domainName,
      subjectAlternativeNames: [`www.${props.domainName}`],
      validation: acm.CertificateValidation.fromDns(this.hostedZone),
    });

    const redirectStore = new cloudfront.KeyValueStore(this, 'RedirectStore', {
      comment: `Redirects for ${props.domainName}`,
      source: cloudfront.ImportSource.fromAsset(redirectsPath),
    });

    const viewerRequestFunction = new cloudfront.Function(
      this,
      'ViewerRequestFunction',
      {
        code: cloudfront.FunctionCode.fromFile({
          filePath: viewerRequestFunctionPath,
        }),
        runtime: cloudfront.FunctionRuntime.JS_2_0,
        keyValueStore: redirectStore,
      },
    );

    const responseHeadersPolicy = new cloudfront.ResponseHeadersPolicy(
      this,
      'SecurityHeaders',
      {
        securityHeadersBehavior: {
          contentSecurityPolicy: {
            contentSecurityPolicy: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://static.cloudflareinsights.com https://www.youtube.com",
              "frame-src youtube.com www.youtube.com https://imgur.com/",
              "style-src 'self' 'unsafe-inline'",
              "img-src * blob: data:",
              "media-src 'none'",
              "connect-src 'self' https://static.cloudflareinsights.com",
              "font-src 'self'",
            ].join('; '),
            override: true,
          },
          strictTransportSecurity: {
            accessControlMaxAge: cdk.Duration.seconds(63072000),
            includeSubdomains: true,
            preload: true,
            override: true,
          },
          contentTypeOptions: { override: true },
          frameOptions: {
            frameOption: cloudfront.HeadersFrameOption.DENY,
            override: true,
          },
          referrerPolicy: {
            referrerPolicy:
              cloudfront.HeadersReferrerPolicy.ORIGIN_WHEN_CROSS_ORIGIN,
            override: true,
          },
          xssProtection: {
            protection: true,
            modeBlock: true,
            override: true,
          },
        },
        customHeadersBehavior: {
          customHeaders: [
            {
              header: 'Permissions-Policy',
              value: 'camera=(), microphone=(), geolocation=()',
              override: true,
            },
            {
              header: 'X-DNS-Prefetch-Control',
              value: 'on',
              override: true,
            },
          ],
        },
      },
    );

    this.distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(this.bucket),
        viewerProtocolPolicy:
          cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        functionAssociations: [
          {
            function: viewerRequestFunction,
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
          },
        ],
        responseHeadersPolicy,
      },
      domainNames: [props.domainName, `www.${props.domainName}`],
      certificate,
      defaultRootObject: 'index.html',
      minimumProtocolVersion:
        cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 404,
          responsePagePath: '/404.html',
          ttl: cdk.Duration.minutes(5),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 404,
          responsePagePath: '/404.html',
          ttl: cdk.Duration.minutes(5),
        },
      ],
    });

    const distributionTarget = route53.RecordTarget.fromAlias(
      new targets.CloudFrontTarget(this.distribution),
    );

    new route53.ARecord(this, 'ARecord', {
      zone: this.hostedZone,
      target: distributionTarget,
    });

    new route53.AaaaRecord(this, 'AAAARecord', {
      zone: this.hostedZone,
      target: distributionTarget,
    });

    new route53.ARecord(this, 'WwwARecord', {
      zone: this.hostedZone,
      recordName: 'www',
      target: distributionTarget,
    });

    new route53.AaaaRecord(this, 'WwwAAAARecord', {
      zone: this.hostedZone,
      recordName: 'www',
      target: distributionTarget,
    });

    new cdk.CfnOutput(this, 'BucketName', {
      value: this.bucket.bucketName,
    });
    new cdk.CfnOutput(this, 'DistributionId', {
      value: this.distribution.distributionId,
    });
    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: this.distribution.distributionDomainName,
    });
    new cdk.CfnOutput(this, 'NameServers', {
      value: cdk.Fn.join(',', this.hostedZone.hostedZoneNameServers!),
    });
  }
}
```

3. Delete the old `buildCloudFrontFunction()` method completely. Once the function code lives in its own file, you no longer need any TypeScript that generates JavaScript strings.

> **Common mistake:** Don't forget `runtime: cloudfront.FunctionRuntime.JS_2_0`. CloudFront KeyValueStore helper methods require JavaScript runtime 2.0.

> **Common mistake:** Your current `infrastructure/cdk.json` excludes `**/*.js` from watch mode. If you use `cdk watch`, changes to `cloudfront/viewer-request.js` will not trigger a resynth until you adjust that exclude list or rerun your commands manually.

### Command breakdown

There isn't a required terminal command in this step if you're editing the construct in your editor. The important verification here is that:

- `StaticSiteProps` no longer includes `redirects`
- the construct creates a `KeyValueStore`
- the function uses `FunctionCode.fromFile(...)`
- the function is associated with the `KeyValueStore`
- `www` `A` and `AAAA` records are created

### Checkpoint

At the end of this step:

- `static-site-construct.ts` should no longer contain `buildCloudFrontFunction`
- the construct should read `viewer-request.js` from disk
- redirects should come from `redirects.json`
- the stack should create four alias records total: apex `A`, apex `AAAA`, `www` `A`, and `www` `AAAA`

---

## Step 4: Simplify the stack entrypoint

### What we're doing and why

Your stack entrypoint no longer needs to pass redirect data inline, because redirects now live in `cloudfront/redirects.json`. That makes `bin/app.ts` smaller and removes the temptation to keep infrastructure data buried inside construct instantiation code.

### Instructions

1. Remove the inline `redirects` object from the stack.

**File: `infrastructure/bin/app.ts`**

```typescript
#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { StaticSiteConstruct } from '../lib/static-site-construct';

class BenjaminChavezSiteStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new StaticSiteConstruct(this, 'Site', {
      domainName: 'benjamin-chavez.com',
    });
  }
}

const app = new cdk.App();
new BenjaminChavezSiteStack(app, 'BenjaminChavezSite', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'us-east-1' },
});
```

### Command breakdown

There isn't a required terminal command in this step if you're editing the file directly. The main thing you're verifying is that `bin/app.ts` only passes stable deployment configuration now, not redirect content.

### Checkpoint

At the end of this step, the only property passed into `StaticSiteConstruct` should be `domainName`.

---

## Step 5: Verify the refactor before you deploy

### What we're doing and why

Refactors like this are deceptively small. The behavior is still "just redirects and clean URLs," but the way those behaviors are sourced has changed a lot. Before you deploy, you want to prove three separate things:

1. TypeScript still compiles.
2. CDK can still synthesize the stack.
3. The CloudFormation diff matches your expectations.

That sequence catches most mistakes before they hit AWS.

### Instructions

1. Type-check the infrastructure package.

```bash
pnpm --dir infrastructure exec tsc --noEmit
```

| Part | What it does |
|------|-------------|
| `pnpm` | Runs a package-manager command using your workspace's configured package manager |
| `--dir infrastructure` | Runs the command from the `infrastructure` package directory |
| `exec` | Executes a binary from that package's dependency graph |
| `tsc` | Runs the TypeScript compiler |
| `--noEmit` | Type-checks without writing compiled output files |

2. Synthesize the stack.

```bash
pnpm --dir infrastructure exec cdk synth
```

| Part | What it does |
|------|-------------|
| `pnpm` | Invokes the package manager |
| `--dir infrastructure` | Runs inside the infrastructure package |
| `exec` | Executes a package-local binary |
| `cdk` | Runs the AWS CDK CLI |
| `synth` | Builds the CloudFormation template locally without deploying |

3. Review the infrastructure diff.

```bash
pnpm --dir infrastructure exec cdk diff
```

| Part | What it does |
|------|-------------|
| `pnpm` | Invokes the package manager |
| `--dir infrastructure` | Runs from the infrastructure package |
| `exec` | Executes the CDK CLI from local dependencies |
| `cdk` | Runs the AWS CDK CLI |
| `diff` | Shows the changes between the deployed stack and your local stack definition |

4. If the synth and diff look right, deploy the stack.

```bash
pnpm --dir infrastructure exec cdk deploy
```

| Part | What it does |
|------|-------------|
| `pnpm` | Invokes the package manager |
| `--dir infrastructure` | Runs inside the infrastructure package |
| `exec` | Executes the package-local CDK CLI |
| `cdk` | Runs the AWS CDK CLI |
| `deploy` | Applies the synthesized CloudFormation changes to your AWS account |

5. Smoke test the deployed behavior:

- request one of the old redirect URLs and make sure you get a `301`
- add a query string like `?utm_source=test` and make sure it survives the redirect
- request `/` and a nested clean URL like `/blog/post`
- test both `benjamin-chavez.com` and `www.benjamin-chavez.com`

### Command breakdown

This step already includes a breakdown table for every terminal command.

### Checkpoint

You should be ready to deploy only after all of the following are true:

- `tsc --noEmit` passes
- `cdk synth` succeeds
- `cdk diff` shows the new KeyValueStore, the updated CloudFront Function, and the additional `www` alias records

---

## Wrapping Up

### What we built

You converted an inline-generated CloudFront Function into a file-backed edge function and moved the redirect map into a CloudFront KeyValueStore import file. That gave you a cleaner separation between logic and data, which is the main architectural win of this refactor.

You also improved the request behavior itself by preserving query strings during redirects and fixed the missing `www` Route 53 alias records so the distribution configuration and DNS configuration finally match.

### What we learned

You learned how to:

- move CloudFront Function code out of inline CDK strings
- use `cloudfront.FunctionCode.fromFile(...)` in CDK
- seed a `cloudfront.KeyValueStore` from a JSON asset
- read redirect data from `cf.kvs()` inside a JavaScript runtime 2.0 function
- preserve query strings when building redirect responses
- close the gap between certificate aliases, CloudFront aliases, and Route 53 records

### Next steps

Once this is working, the next improvements I'd consider are:

- add a small test harness for the viewer-request function so you can exercise redirect and rewrite cases locally
- decide whether `infrastructure/cdk.json` should keep excluding `**/*.js` if you plan to use `cdk watch`
- add a couple of regression cases for dotted slugs like `/blog/v2.1` if those URLs matter for your site
