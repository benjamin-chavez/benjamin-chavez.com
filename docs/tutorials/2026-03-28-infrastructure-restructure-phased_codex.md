# Restructuring This Infrastructure Package for Cross-App Consistency: A Step-by-Step Tutorial

> **What you'll build:** A cleaner `infrastructure` package that separates stacks from constructs, centralizes deployment config, and treats the CloudFront handler JavaScript as generated output in `dist/`.
>
> **What you'll learn:**
> - How to separate deployment orchestration from reusable infrastructure modules
> - How to introduce typed infrastructure config without overbuilding multi-environment support
> - How to move CloudFront routing concerns behind a dedicated construct
> - How to emit a compiled CloudFront handler into `dist/cloudfront/viewer-request.js`
> - How to verify a structural refactor with `build`, `synth`, and `diff`
>
> **Prerequisites:** You should be comfortable reading TypeScript, making small CDK refactors, and running `pnpm` commands from this repo.
>
> **Estimated time:** 60-90 minutes

---

## Table of Contents

- [Introduction](#introduction)
- [Step 1: Split stack orchestration from reusable site infrastructure](#step-1-split-stack-orchestration-from-reusable-site-infrastructure)
- [Step 2: Introduce typed infrastructure config](#step-2-introduce-typed-infrastructure-config)
- [Step 3: Move CloudFront routing assets behind a dedicated module](#step-3-move-cloudfront-routing-assets-behind-a-dedicated-module)
- [Step 4: Verify the refactor end to end](#step-4-verify-the-refactor-end-to-end)
- [Wrapping Up](#wrapping-up)

---

## Introduction

Right now, this repo's infrastructure package works, but it is shaped differently from the more structured infrastructure package in your `webapp_v2` app. The current package has one large construct, a thin `bin/app.ts`, some build wiring for the CloudFront handler, and a mix of source and generated concerns spread across `lib`, `edge`, and `cloudfront`.

That structure is fine for a small first version, but it makes future changes harder than they need to be. One file currently owns reusable infrastructure behavior, stack-level outputs, and some deployment-level decisions. CloudFront routing logic is also split across the construct, the edge source, the generated JavaScript asset, and the build configuration.

In this tutorial, you'll restructure the package in three phases. First you'll split stack-level orchestration from reusable infrastructure. Then you'll add typed config so deployment values stop living inline in `bin/app.ts`. Finally, you'll move CloudFront routing concerns behind a dedicated construct and emit the compiled handler into `infrastructure/dist/cloudfront/viewer-request.js`, where generated code belongs.

---

## Step 1: Split stack orchestration from reusable site infrastructure

### What we're doing and why

The first phase is about boundaries. In your `webapp_v2` repo, the infrastructure package has a clear distinction between deployment entrypoints and reusable building blocks. That distinction matters because a stack answers the question "what gets deployed together?", while a construct answers the question "what reusable infrastructure concept am I composing?"

Your current `StaticSiteConstruct` mixes both roles. It provisions the site resources, but it also owns CloudFormation outputs. Those outputs are a stack-level concern because they describe the deployed unit, not the reusable site module itself. Splitting these roles now gives you a stable package shape for everything else that follows.

### Instructions

1. Create the target directories for stacks, constructs, and config.

```bash
mkdir -p infrastructure/lib/stacks infrastructure/lib/constructs infrastructure/lib/config
```

| Part | What it does |
|------|-------------|
| `mkdir` | Creates directories on disk |
| `-p` | Creates missing parent directories and makes the command safe to rerun |
| `infrastructure/lib/stacks` | The home for deployment units such as `StaticSiteStack` |
| `infrastructure/lib/constructs` | The home for reusable infrastructure building blocks |
| `infrastructure/lib/config` | The home for typed deployment config in the next phase |

2. Move the current construct file into the new constructs folder.

```bash
mv infrastructure/lib/static-site-construct.ts infrastructure/lib/constructs/static-site.ts
```

| Part | What it does |
|------|-------------|
| `mv` | Moves or renames a file |
| `infrastructure/lib/static-site-construct.ts` | The current monolithic site construct file |
| `infrastructure/lib/constructs/static-site.ts` | The new location for the reusable site construct |

3. Replace the moved file with a construct that owns resource provisioning only and no stack outputs.

**File: `infrastructure/lib/constructs/static-site.ts`**

```typescript
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
  alternateDomainNames: string[];
  routing: {
    compiledEdgeAssetPath: string;
    redirectsAssetPath: string;
  };
}

export class StaticSite extends Construct {
  public readonly bucket: s3.Bucket;
  public readonly distribution: cloudfront.Distribution;
  public readonly hostedZone: route53.PublicHostedZone;

  constructor(scope: Construct, id: string, props: StaticSiteProps) {
    super(scope, id);

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
      subjectAlternativeNames: props.alternateDomainNames,
      validation: acm.CertificateValidation.fromDns(this.hostedZone),
    });

    const redirectStore = new cloudfront.KeyValueStore(this, 'RedirectStore', {
      comment: `Redirects for ${props.domainName}`,
      source: cloudfront.ImportSource.fromAsset(props.routing.redirectsAssetPath),
    });

    const viewerRequestFunction = new cloudfront.Function(
      this,
      'ViewerRequestFunction',
      {
        code: cloudfront.FunctionCode.fromFile({
          filePath: props.routing.compiledEdgeAssetPath,
        }),
        // CloudFront KeyValueStore requires the JS_2_0 runtime.
        runtime: cloudfront.FunctionRuntime.JS_2_0,
        keyValueStore: redirectStore,
      },
    );

    const responseHeadersPolicy = this.createResponseHeadersPolicy();

    this.distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(this.bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        functionAssociations: [
          {
            function: viewerRequestFunction,
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
          },
        ],
        responseHeadersPolicy,
      },
      domainNames: [props.domainName, ...props.alternateDomainNames],
      certificate,
      defaultRootObject: 'index.html',
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
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

    for (const [index, alternateDomainName] of props.alternateDomainNames.entries()) {
      const recordName = this.getRecordName(
        alternateDomainName,
        props.domainName,
      );

      new route53.ARecord(this, `AlternateARecord${index}`, {
        zone: this.hostedZone,
        recordName,
        target: distributionTarget,
      });

      new route53.AaaaRecord(this, `AlternateAAAARecord${index}`, {
        zone: this.hostedZone,
        recordName,
        target: distributionTarget,
      });
    }
  }

  private createResponseHeadersPolicy(): cloudfront.ResponseHeadersPolicy {
    return new cloudfront.ResponseHeadersPolicy(this, 'SecurityHeaders', {
      securityHeadersBehavior: {
        contentSecurityPolicy: {
          contentSecurityPolicy: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://static.cloudflareinsights.com https://www.youtube.com",
            'frame-src youtube.com www.youtube.com https://imgur.com/',
            "style-src 'self' 'unsafe-inline'",
            'img-src * blob: data:',
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
    });
  }

  private getRecordName(fullDomainName: string, rootDomainName: string): string {
    const suffix = `.${rootDomainName}`;

    if (!fullDomainName.endsWith(suffix)) {
      throw new Error(
        `Alternate domain "${fullDomainName}" must end with ".${rootDomainName}"`,
      );
    }

    return fullDomainName.slice(0, -suffix.length);
  }
}
```

4. Add a real stack file that owns the deployment unit and CloudFormation outputs.

**File: `infrastructure/lib/stacks/static-site-stack.ts`**

```typescript
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { StaticSite } from '../constructs/static-site';

export interface StaticSiteStackProps extends cdk.StackProps {
  domainName: string;
  alternateDomainNames: string[];
  routing: {
    compiledEdgeAssetPath: string;
    redirectsAssetPath: string;
  };
}

export class StaticSiteStack extends cdk.Stack {
  public readonly site: StaticSite;

  constructor(scope: Construct, id: string, props: StaticSiteStackProps) {
    super(scope, id, props);

    this.site = new StaticSite(this, 'Site', {
      domainName: props.domainName,
      alternateDomainNames: props.alternateDomainNames,
      routing: props.routing,
    });

    new cdk.CfnOutput(this, 'BucketName', {
      value: this.site.bucket.bucketName,
    });

    new cdk.CfnOutput(this, 'DistributionId', {
      value: this.site.distribution.distributionId,
    });

    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: this.site.distribution.distributionDomainName,
    });

    new cdk.CfnOutput(this, 'NameServers', {
      value: cdk.Fn.join(',', this.site.hostedZone.hostedZoneNameServers!),
    });
  }
}
```

5. Update the CDK entrypoint so it creates a stack, not a construct directly.

**File: `infrastructure/bin/app.ts`**

```typescript
#!/usr/bin/env node

import * as path from 'node:path';
import * as cdk from 'aws-cdk-lib';
import { StaticSiteStack } from '../lib/stacks/static-site-stack';

const app = new cdk.App();
const infrastructureRoot = process.cwd();

new StaticSiteStack(app, 'BenjaminChavezSite', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'us-east-1' },
  domainName: 'benjamin-chavez.com',
  alternateDomainNames: ['www.benjamin-chavez.com'],
  routing: {
    compiledEdgeAssetPath: path.join(
      infrastructureRoot,
      'cloudfront',
      'viewer-request.js',
    ),
    redirectsAssetPath: path.join(
      infrastructureRoot,
      'cloudfront',
      'redirects.json',
    ),
  },
});
```

> **Common mistake:** Don't leave `CfnOutput` declarations in the construct "because they're already there." Outputs describe the deployed stack, not the reusable module. If you leave them in the construct, you keep the same coupling under a different filename.

### Command breakdown

You created the new package structure with:

```bash
mkdir -p infrastructure/lib/stacks infrastructure/lib/constructs infrastructure/lib/config
```

| Part | What it does |
|------|-------------|
| `mkdir` | Creates directories |
| `-p` | Creates missing parents and avoids errors if the directories already exist |
| `infrastructure/lib/stacks` | New home for stack classes |
| `infrastructure/lib/constructs` | New home for reusable constructs |
| `infrastructure/lib/config` | New home for typed deployment config |

You moved the site construct file with:

```bash
mv infrastructure/lib/static-site-construct.ts infrastructure/lib/constructs/static-site.ts
```

| Part | What it does |
|------|-------------|
| `mv` | Moves or renames a file |
| `infrastructure/lib/static-site-construct.ts` | The original construct path |
| `infrastructure/lib/constructs/static-site.ts` | The target construct path after the split |

### Checkpoint

At the end of this step:

- `bin/app.ts` should instantiate `StaticSiteStack`, not `StaticSite`
- `lib/stacks/static-site-stack.ts` should exist
- `lib/constructs/static-site.ts` should exist
- CloudFormation outputs should live in the stack file
- The construct should still expose `bucket`, `distribution`, and `hostedZone`

---

## Step 2: Introduce typed infrastructure config

### What we're doing and why

Now that the package boundaries are cleaner, you can move the deployment values out of `bin/app.ts`. This is where many small infrastructure repos get messy over time: a stack starts with one inline domain name or one hardcoded region, and a few months later the entrypoint becomes an accidental config file.

The goal here is not to build a full multi-environment system. That would be overkill for this repo today. Instead, you'll create a typed config boundary that models the current production site cleanly and leaves a natural place to add more environments later if you need them.

### Instructions

1. Define the typed config boundary for this package.

**File: `infrastructure/lib/config/types.ts`**

```typescript
export type SiteEnvironmentName = 'prod';

export interface SiteEnvironmentConfig {
  readonly envName: SiteEnvironmentName;
  readonly account: string;
  readonly region: string;
  readonly domainName: string;
  readonly alternateDomainNames: string[];
  readonly compiledEdgeAssetPath: string;
  readonly redirectsAssetPath: string;
}

export interface SiteAppConfig {
  readonly appName: string;
  readonly stackName: string;
  readonly environments: Record<SiteEnvironmentName, SiteEnvironmentConfig>;
}
```

2. Add the concrete app-level config for this repo.

**File: `infrastructure/lib/config/site-config.ts`**

```typescript
import * as path from 'node:path';
import type { SiteAppConfig } from './types';

const infrastructureRoot = process.cwd();

export const appConfig: SiteAppConfig = {
  appName: 'benjamin-chavez-com',
  stackName: 'BenjaminChavezSite',
  environments: {
    prod: {
      envName: 'prod',
      account: '${CDK_DEFAULT_ACCOUNT}',
      region: 'us-east-1',
      domainName: 'benjamin-chavez.com',
      alternateDomainNames: ['www.benjamin-chavez.com'],
      compiledEdgeAssetPath: path.join(
        infrastructureRoot,
        'dist',
        'cloudfront',
        'viewer-request.js',
      ),
      redirectsAssetPath: path.join(
        infrastructureRoot,
        'assets',
        'cloudfront',
        'redirects.json',
      ),
    },
  },
};
```

3. Update the stack so it takes `appName`, `environment`, and `envConfig` like your other stack files.

**File: `infrastructure/lib/stacks/static-site-stack.ts`**

```typescript
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import type {
  SiteEnvironmentConfig,
  SiteEnvironmentName,
} from '../config/types';
import { StaticSite } from '../constructs/static-site';

export interface StaticSiteStackProps extends cdk.StackProps {
  readonly appName: string;
  readonly environment: SiteEnvironmentName;
  readonly envConfig: SiteEnvironmentConfig;
}

export class StaticSiteStack extends cdk.Stack {
  public readonly site: StaticSite;

  constructor(scope: Construct, id: string, props: StaticSiteStackProps) {
    super(scope, id, props);
    const { appName, environment, envConfig } = props;

    this.site = new StaticSite(this, 'Site', {
      appName,
      environment,
      envConfig,
    });

    new cdk.CfnOutput(this, 'BucketName', {
      value: this.site.bucket.bucketName,
    });

    new cdk.CfnOutput(this, 'DistributionId', {
      value: this.site.distribution.distributionId,
    });

    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: this.site.distribution.distributionDomainName,
    });

    new cdk.CfnOutput(this, 'NameServers', {
      value: cdk.Fn.join(',', this.site.hostedZone.hostedZoneNameServers!),
    });
  }
}
```

4. Simplify `bin/app.ts` so it imports config instead of defining deployment values inline.

**File: `infrastructure/bin/app.ts`**

```typescript
#!/usr/bin/env node

import * as cdk from 'aws-cdk-lib';
import { appConfig } from '../lib/config/site-config';
import type { SiteEnvironmentName } from '../lib/config/types';
import { StaticSiteStack } from '../lib/stacks/static-site-stack';

const app = new cdk.App();
const targetEnv = (
  app.node.tryGetContext('env') ||
  process.env.CDK_ENV ||
  'prod'
) as SiteEnvironmentName;
const envConfig = appConfig.environments[targetEnv];

if (!envConfig) {
  throw new Error(
    `Environment "${targetEnv}" not found. Available environments: ${Object.keys(appConfig.environments).join(', ')}`,
  );
}

const account =
  envConfig.account.replace(
    '${CDK_DEFAULT_ACCOUNT}',
    process.env.CDK_DEFAULT_ACCOUNT ?? '',
  ) || process.env.CDK_DEFAULT_ACCOUNT;

const region = envConfig.region.replace(
  '${CDK_DEFAULT_REGION}',
  process.env.CDK_DEFAULT_REGION ?? envConfig.region,
);

new StaticSiteStack(app, appConfig.stackName, {
  env: { account, region },
  appName: appConfig.appName,
  environment: envConfig.envName,
  envConfig,
});
```

> **Common mistake:** Don't jump straight to a large `dev`/`prod`/`preview` matrix just because `webapp_v2` has more infrastructure. The right move here is to mirror the `appConfig` / `envConfig` grouping, while still keeping this repo single-environment for now.

### Command breakdown

There isn't a required terminal command in this step if you're editing the files in your editor. The important thing to verify is that `bin/app.ts` no longer hardcodes deployment values, and that those values now live under `appConfig.environments.prod` in `lib/config/site-config.ts`.

### Checkpoint

At the end of this step:

- `lib/config/types.ts` should define the deployment contract
- `lib/config/site-config.ts` should export `appConfig`
- `bin/app.ts` should resolve `targetEnv`, `envConfig`, and `env`
- `StaticSiteStack` should accept `appName`, `environment`, and `envConfig`

---

## Step 3: Move CloudFront routing assets behind a dedicated module

### What we're doing and why

This is the phase that cleans up the CloudFront routing story. Right now the logic is split across four concerns:

- the TypeScript edge source in `edge/`
- the generated JavaScript asset
- the redirects JSON asset
- the construct code that wires those assets into CloudFront

That split is normal, but right now it is too shallow. You have to understand multiple files and multiple config surfaces to make a single routing change safely. The fix is to deepen the module boundary: one construct owns routing wiring, TypeScript stays the source of truth, and the deployable JavaScript asset becomes generated output in `dist/`.

### Instructions

1. Create the final asset directory for source-controlled CloudFront data.

```bash
mkdir -p infrastructure/assets/cloudfront
```

| Part | What it does |
|------|-------------|
| `mkdir` | Creates directories |
| `-p` | Creates missing parents safely |
| `infrastructure/assets/cloudfront` | New home for source-controlled routing assets such as `redirects.json` |

2. Move the redirects asset out of the current `cloudfront/` folder.

```bash
mv infrastructure/cloudfront/redirects.json infrastructure/assets/cloudfront/redirects.json
```

| Part | What it does |
|------|-------------|
| `mv` | Moves or renames a file |
| `infrastructure/cloudfront/redirects.json` | The current redirects asset path |
| `infrastructure/assets/cloudfront/redirects.json` | The new source-controlled asset location |

3. Update the edge TypeScript compiler so the generated JavaScript goes to `dist/cloudfront`.

**File: `infrastructure/tsconfig.edge.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "node",
    "lib": ["ES2022"],
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "declaration": false,
    "sourceMap": false,
    "rootDir": "./edge",
    "outDir": "./dist/cloudfront"
  },
  "include": ["edge/**/*.ts", "edge/**/*.d.ts"]
}
```

4. Create a dedicated construct that owns CloudFront routing assets and wiring.

**File: `infrastructure/lib/constructs/cloudfront-routing.ts`**

```typescript
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { Construct } from 'constructs';

export interface CloudFrontRoutingProps {
  readonly appName: string;
  readonly environment: string;
  readonly domainName: string;
  readonly compiledEdgeAssetPath: string;
  readonly redirectsAssetPath: string;
}

export class CloudFrontRouting extends Construct {
  public readonly redirectStore: cloudfront.KeyValueStore;
  public readonly viewerRequestFunction: cloudfront.Function;

  constructor(scope: Construct, id: string, props: CloudFrontRoutingProps) {
    super(scope, id);
    const {
      appName,
      compiledEdgeAssetPath,
      domainName,
      environment,
      redirectsAssetPath,
    } = props;

    this.redirectStore = new cloudfront.KeyValueStore(this, 'RedirectStore', {
      comment: `Redirects for ${appName} (${environment}) - ${domainName}`,
      source: cloudfront.ImportSource.fromAsset(redirectsAssetPath),
    });

    this.viewerRequestFunction = new cloudfront.Function(
      this,
      'ViewerRequestFunction',
      {
        code: cloudfront.FunctionCode.fromFile({
          filePath: compiledEdgeAssetPath,
        }),
        // CloudFront KeyValueStore requires the JS_2_0 runtime.
        runtime: cloudfront.FunctionRuntime.JS_2_0,
        keyValueStore: this.redirectStore,
      },
    );
  }
}
```

5. Update the site construct so it composes routing instead of wiring it inline.

**File: `infrastructure/lib/constructs/static-site.ts`**

```diff
import { CloudFrontRouting } from './cloudfront-routing';

export interface StaticSiteProps {
  readonly appName: string;
  readonly environment: SiteEnvironmentName;
  readonly envConfig: SiteEnvironmentConfig;
}

export class StaticSite extends Construct {
  public readonly bucket: s3.Bucket;
  public readonly distribution: cloudfront.Distribution;
  public readonly hostedZone: route53.PublicHostedZone;

  constructor(scope: Construct, id: string, props: StaticSiteProps) {
    super(scope, id);
    const { appName, environment, envConfig } = props;
    const {
      alternateDomainNames,
      compiledEdgeAssetPath,
      domainName,
      redirectsAssetPath,
    } = envConfig;

    this.bucket = new s3.Bucket(this, 'SiteBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      encryption: s3.BucketEncryption.S3_MANAGED,
    });

    this.hostedZone = new route53.PublicHostedZone(this, 'HostedZone', {
      zoneName: domainName,
    });

    const certificate = new acm.Certificate(this, 'Certificate', {
      domainName,
      subjectAlternativeNames: alternateDomainNames,
      validation: acm.CertificateValidation.fromDns(this.hostedZone),
    });

+    const routing = new CloudFrontRouting(this, 'CloudFrontRouting', {
+      appName,
+      environment,
+      domainName,
+      compiledEdgeAssetPath,
+      redirectsAssetPath,
+    });

    const responseHeadersPolicy = this.createResponseHeadersPolicy();

    this.distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(this.bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        functionAssociations: [
          {
-            function: viewerRequestFunction,
+            function: routing.viewerRequestFunction,
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
          },
        ],
        responseHeadersPolicy,
      },
      domainNames: [domainName, ...alternateDomainNames],
      certificate,
      defaultRootObject: 'index.html',
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
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
  }
}
```

6. Update the app config so the production environment points to the new asset locations.

**File: `infrastructure/lib/config/site-config.ts`**

```typescript
import * as path from 'node:path';
import type { SiteAppConfig } from './types';

const infrastructureRoot = process.cwd();

export const appConfig: SiteAppConfig = {
  appName: 'benjamin-chavez-com',
  stackName: 'BenjaminChavezSite',
  environments: {
    prod: {
      envName: 'prod',
      account: '${CDK_DEFAULT_ACCOUNT}',
      region: 'us-east-1',
      domainName: 'benjamin-chavez.com',
      alternateDomainNames: ['www.benjamin-chavez.com'],
      compiledEdgeAssetPath: path.join(
        infrastructureRoot,
        'dist',
        'cloudfront',
        'viewer-request.js',
      ),
      redirectsAssetPath: path.join(
        infrastructureRoot,
        'assets',
        'cloudfront',
        'redirects.json',
      ),
    },
  },
};
```

7. Stop tracking the old source-controlled compiled JavaScript file.

```bash
git rm infrastructure/cloudfront/viewer-request.js
```

| Part | What it does |
|------|-------------|
| `git rm` | Removes a tracked file from the repository and working tree |
| `infrastructure/cloudfront/viewer-request.js` | The old source-controlled compiled CloudFront handler that should no longer be edited or tracked |

> **Common mistake:** Don't manually edit `infrastructure/dist/cloudfront/viewer-request.js` after this step. That file is generated output. The source of truth is `infrastructure/edge/viewer-request.ts`.

> **Common mistake:** Don't keep CloudFront routing partially in `static-site.ts` and partially in `cloudfront-routing.ts`. Once you introduce the routing construct, let it own the KVS and viewer-request function wiring completely.

### Command breakdown

You created the new asset directory with:

```bash
mkdir -p infrastructure/assets/cloudfront
```

| Part | What it does |
|------|-------------|
| `mkdir` | Creates directories |
| `-p` | Creates missing parents and avoids rerun failures |
| `infrastructure/assets/cloudfront` | New home for source-controlled CloudFront data assets |

You moved the redirects file with:

```bash
mv infrastructure/cloudfront/redirects.json infrastructure/assets/cloudfront/redirects.json
```

| Part | What it does |
|------|-------------|
| `mv` | Moves a file |
| `infrastructure/cloudfront/redirects.json` | Old redirects asset path |
| `infrastructure/assets/cloudfront/redirects.json` | New redirects asset path |

You removed the old tracked compiled handler with:

```bash
git rm infrastructure/cloudfront/viewer-request.js
```

| Part | What it does |
|------|-------------|
| `git rm` | Stops tracking a file and deletes it from the working tree |
| `infrastructure/cloudfront/viewer-request.js` | The old compiled CloudFront asset that should no longer live in source control |

### Checkpoint

At the end of this step:

- `edge/viewer-request.ts` should still be the only source of truth for the handler
- `assets/cloudfront/redirects.json` should exist
- `tsconfig.edge.json` should emit to `dist/cloudfront`
- `lib/constructs/cloudfront-routing.ts` should exist
- `static-site.ts` should use `CloudFrontRouting`
- `appConfig.environments.prod` should point at `dist/cloudfront/viewer-request.js`

---

## Step 4: Verify the refactor end to end

### What we're doing and why

Structural refactors are easy to get "mostly right" and still break on path resolution, generated assets, or CDK synthesis. Verification matters here because your goal is not just a prettier folder tree. The goal is a different internal structure with the same deployed behavior.

This verification sequence checks the refactor from three angles:

- build correctness
- asset generation correctness
- infrastructure synthesis/diff correctness

### Instructions

1. Build the infrastructure package, including the edge handler.

```bash
pnpm --dir infrastructure run build
```

| Part | What it does |
|------|-------------|
| `pnpm` | Invokes the package manager |
| `--dir infrastructure` | Runs the command from the infrastructure package directory |
| `run` | Executes a package script |
| `build` | Rebuilds the edge asset and then compiles the infrastructure TypeScript package |

2. Confirm that the compiled handler exists in `dist/cloudfront`.

```bash
ls -la infrastructure/dist/cloudfront/viewer-request.js
```

| Part | What it does |
|------|-------------|
| `ls` | Lists files |
| `-la` | Shows detailed output including permissions and timestamps |
| `infrastructure/dist/cloudfront/viewer-request.js` | The generated CloudFront handler asset you expect after the build |

3. Synthesize the stack.

```bash
pnpm --dir infrastructure run synth
```

| Part | What it does |
|------|-------------|
| `pnpm` | Invokes the package manager |
| `--dir infrastructure` | Runs inside the infrastructure package |
| `run` | Executes a package script |
| `synth` | Rebuilds the edge asset and then synthesizes the CDK stack locally |

4. Review the infrastructure diff.

```bash
pnpm --dir infrastructure run diff
```

| Part | What it does |
|------|-------------|
| `pnpm` | Invokes the package manager |
| `--dir infrastructure` | Runs inside the infrastructure package |
| `run` | Executes a package script |
| `diff` | Rebuilds the edge asset and shows the change set against the deployed stack |

5. Smoke test the routing behavior after deployment:

- request a known redirect URL and verify you get a `301`
- add a query string and make sure it survives the redirect
- request `/` and a clean nested URL
- verify both `benjamin-chavez.com` and `www.benjamin-chavez.com`

### Command breakdown

This step already includes a breakdown table for every terminal command.

### Checkpoint

You should be ready to deploy only after all of the following are true:

- `pnpm --dir infrastructure run build` passes
- `infrastructure/dist/cloudfront/viewer-request.js` exists
- `pnpm --dir infrastructure run synth` succeeds
- `pnpm --dir infrastructure run diff` shows only the intended structural/resource changes

---

## Wrapping Up

### What we built

You restructured the infrastructure package around clearer module boundaries. The deployment entrypoint now points to a stack, the reusable site infrastructure lives in a construct, deployment values come from typed config, and CloudFront routing is owned by a dedicated module instead of being scattered across unrelated files.

You also moved the compiled viewer-request handler into `dist/cloudfront`, which makes the source-versus-generated distinction much clearer. `edge/viewer-request.ts` becomes the only source of truth, and the deployable JavaScript asset becomes a build artifact instead of a source-controlled file you might accidentally edit by hand.

### What we learned

You learned how to:

- separate stack responsibilities from construct responsibilities
- introduce typed infrastructure config without prematurely building a full environment system
- move edge routing wiring into its own construct boundary
- keep source-controlled assets in `assets/` and generated artifacts in `dist/`
- verify a structural refactor with build, synth, and diff rather than relying on folder moves alone

### Next steps

After this refactor is complete, the next improvements worth considering are:

- adding CDK assertions around the static site stack so structure changes are easier to validate
- extracting the response headers policy into its own helper or construct if you expect to reuse it
- introducing a second config object only when you actually need another deployment environment
