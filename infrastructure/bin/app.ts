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

cdk.Tags.of(app).add('Project', appContext.appName); // benjamin-chavez.com
cdk.Tags.of(app).add('Environment', environment); // prod
cdk.Tags.of(app).add('Stack', `${appContext.appName}-${environment}`); // benjamin-chavez.com-prod
cdk.Tags.of(app).add('ManagedBy', 'cdk');
cdk.Tags.of(app).add('Owner', 'ben');

new StaticSiteStack(app, appContext.stackName, {
  env,
  appName: appContext.appName,
  environment,
  envConfig,
});
