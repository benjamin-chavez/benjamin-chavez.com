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
  redirects?: Record<string, string>;
}

export class StaticSiteConstruct extends Construct {
  public readonly bucket: s3.Bucket;
  public readonly distribution: cloudfront.Distribution;
  public readonly hostedZone: route53.PublicHostedZone;

  constructor(scope: Construct, id: string, props: StaticSiteProps) {
    super(scope, id);

    // S3 bucket — private, CloudFront OAC access only
    this.bucket = new s3.Bucket(this, 'SiteBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      encryption: s3.BucketEncryption.S3_MANAGED,
    });

    // Route 53 hosted zone
    this.hostedZone = new route53.PublicHostedZone(this, 'HostedZone', {
      zoneName: props.domainName,
    });

    // ACM certificate (DNS-validated via Route 53)
    const certificate = new acm.Certificate(this, 'Certificate', {
      domainName: props.domainName,
      subjectAlternativeNames: [`www.${props.domainName}`],
      validation: acm.CertificateValidation.fromDns(this.hostedZone),
    });

    // CloudFront Function for clean URLs + redirects
    const viewerRequestFunction = new cloudfront.Function(
      this,
      'ViewerRequestFunction',
      {
        code: cloudfront.FunctionCode.fromInline(
          this.buildCloudFrontFunction(props.redirects ?? {}),
        ),
        runtime: cloudfront.FunctionRuntime.JS_2_0,
      },
    );

    // Response headers policy with security headers
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

    // CloudFront distribution
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

    // DNS records
    new route53.ARecord(this, 'ARecord', {
      zone: this.hostedZone,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(this.distribution),
      ),
    });

    new route53.AaaaRecord(this, 'AAAARecord', {
      zone: this.hostedZone,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(this.distribution),
      ),
    });

    // Stack outputs
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

  private buildCloudFrontFunction(
    redirects: Record<string, string>,
  ): string {
    const redirectEntries = Object.entries(redirects)
      .map(([from, to]) => `    '${from}': '${to}'`)
      .join(',\n');

    return `
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  var redirects = {
${redirectEntries}
  };
  if (redirects[uri]) {
    return {
      statusCode: 301,
      headers: { location: { value: redirects[uri] } }
    };
  }

  if (uri.endsWith('/')) {
    request.uri += 'index.html';
  } else if (!uri.includes('.')) {
    request.uri += '/index.html';
  }

  return request;
}
`;
  }
}
