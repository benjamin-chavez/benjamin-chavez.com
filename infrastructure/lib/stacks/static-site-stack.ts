import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import type {
  EnvironmentName,
  ResolvedEnvironmentConfig,
} from '../config/types';
import { StaticSite } from '../constructs/static-site';

export interface StaticSiteStackProps extends cdk.StackProps {
  readonly appName: string;
  readonly environment: EnvironmentName;
  readonly envConfig: ResolvedEnvironmentConfig;
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
