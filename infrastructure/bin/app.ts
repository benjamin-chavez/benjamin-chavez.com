#!/usr/bin/env node

// infrastructure/bin/app.ts

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
