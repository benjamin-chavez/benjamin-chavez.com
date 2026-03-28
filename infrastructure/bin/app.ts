#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { StaticSiteConstruct } from '../lib/static-site-construct';

class BenjaminChavezSiteStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new StaticSiteConstruct(this, 'Site', {
      domainName: 'benjamin-chavez.com',
      redirects: {
        '/blog/step-by-step-guide-setting-up-expressjs-typescript-web-app':
          '/blog/creating-a-typescript-express.js-web-application-with-es6-step-by-step-guide/',
        '/downloads/epay-mailer':
          '/downloads/Estimated%20Tax%20Payment%20Mailer.zip',
      },
    });
  }
}

const app = new cdk.App();
new BenjaminChavezSiteStack(app, 'BenjaminChavezSite', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'us-east-1' },
});
