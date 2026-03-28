#!/usr/bin/env node

import * as cdk from 'aws-cdk-lib';
import {
  loadAppContext,
  resolveEnvironmentConfig,
} from '../lib/config/site-config';
import { StaticSiteStack } from '../lib/stacks/static-site-stack';

const app = new cdk.App();
const appContext = loadAppContext(app);
const targetEnv =
  app.node.tryGetContext('env') || process.env.CDK_ENV || 'prod';
const { environment, env, envConfig } = resolveEnvironmentConfig(
  appContext,
  targetEnv,
);

new StaticSiteStack(app, appContext.stackName, {
  env,
  appName: appContext.appName,
  environment,
  envConfig,
});
