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
