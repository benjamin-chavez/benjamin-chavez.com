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
