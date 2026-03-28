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
