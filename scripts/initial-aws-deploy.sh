#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")/.."

MODE="${1:---check}"

if [[ "$MODE" != "--check" && "$MODE" != "--apply" ]]; then
  echo "Usage: scripts/initial-aws-deploy.sh [--check|--apply]" >&2
  exit 1
fi

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

require_env() {
  local name="$1"

  if [[ -z "${!name:-}" ]]; then
    echo "Missing required environment variable: $name" >&2
    exit 1
  fi
}

require_file() {
  local path="$1"

  if [[ ! -f "$path" ]]; then
    echo "Missing required file: $path" >&2
    exit 1
  fi
}

require_env_file_value() {
  local name="$1"
  local path="$2"

  if ! grep -Eq "^${name}=.+" "$path"; then
    echo "Expected $name to be set in $path" >&2
    exit 1
  fi
}

require_command aws
require_command jq
require_command pnpm

require_env AWS_REGION
require_env CLOUDFRONT_CERTIFICATE_REGION

AWS_ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"

export AWS_DEFAULT_REGION="${AWS_DEFAULT_REGION:-$AWS_REGION}"
export CDK_DEFAULT_REGION="${CDK_DEFAULT_REGION:-$AWS_REGION}"
export CDK_DEFAULT_ACCOUNT="${CDK_DEFAULT_ACCOUNT:-$AWS_ACCOUNT_ID}"

STACK_NAME="${CDK_STACK_NAME:-$(jq -r '.context.stackName' infrastructure/cdk.json)}"
if [[ -z "$STACK_NAME" || "$STACK_NAME" == "null" ]]; then
  echo "Could not resolve stack name from infrastructure/cdk.json" >&2
  exit 1
fi

require_file .env.local
require_env_file_value NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME .env.local
require_env_file_value NEXT_PUBLIC_APP_URL .env.local

export NEXT_PUBLIC_AWS_REGION="${NEXT_PUBLIC_AWS_REGION:-$AWS_REGION}"

echo "Mode: $MODE"
echo "AWS_REGION: $AWS_REGION"
echo "NEXT_PUBLIC_AWS_REGION: $NEXT_PUBLIC_AWS_REGION"
echo "CLOUDFRONT_CERTIFICATE_REGION: $CLOUDFRONT_CERTIFICATE_REGION"
echo "CDK_DEFAULT_ACCOUNT: $CDK_DEFAULT_ACCOUNT"
echo "CDK stack: $STACK_NAME"

echo
if [[ ! -x infrastructure/node_modules/.bin/ts-node || ! -x infrastructure/node_modules/.bin/cdk ]]; then
  echo "Installing infrastructure dependencies..."
  CI=true pnpm --dir infrastructure install --frozen-lockfile
else
  echo "Infrastructure dependencies already installed."
fi

echo
echo "Checking infrastructure diff..."
pnpm --dir infrastructure run diff

if [[ "$MODE" == "--check" ]]; then
  echo
  echo "Preflight checks passed. Re-run with --apply to deploy."
  exit 0
fi

echo
echo "Bootstrapping CDK..."
pnpm --dir infrastructure exec cdk bootstrap \
  "aws://$CDK_DEFAULT_ACCOUNT/$CDK_DEFAULT_REGION"

echo
echo "Deploying infrastructure..."
pnpm --dir infrastructure run deploy -- --require-approval never

echo
echo "Building static site..."
pnpm build

echo
echo "Reading CloudFormation outputs..."
OUTPUTS_JSON="$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --query 'Stacks[0].Outputs' \
  --output json)"

BUCKET_NAME="$(echo "$OUTPUTS_JSON" | jq -r '.[] | select(.OutputKey=="BucketName") | .OutputValue')"
DISTRIBUTION_ID="$(echo "$OUTPUTS_JSON" | jq -r '.[] | select(.OutputKey=="DistributionId") | .OutputValue')"
DISTRIBUTION_DOMAIN_NAME="$(echo "$OUTPUTS_JSON" | jq -r '.[] | select(.OutputKey=="DistributionDomainName") | .OutputValue')"
NAME_SERVERS="$(echo "$OUTPUTS_JSON" | jq -r '.[] | select(.OutputKey=="NameServers") | .OutputValue')"

if [[ -z "$BUCKET_NAME" || -z "$DISTRIBUTION_ID" || -z "$DISTRIBUTION_DOMAIN_NAME" || -z "$NAME_SERVERS" ]]; then
  echo "One or more required CloudFormation outputs were missing." >&2
  exit 1
fi

echo
echo "Syncing dist/ to S3..."
aws s3 sync dist/ "s3://$BUCKET_NAME" --delete

echo
echo "Invalidating CloudFront..."
aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*"

echo
echo "Initial deployment completed."
echo "Bucket: $BUCKET_NAME"
echo "Distribution ID: $DISTRIBUTION_ID"
echo "Distribution domain: $DISTRIBUTION_DOMAIN_NAME"
echo "Route 53 nameservers: $NAME_SERVERS"
echo
echo "Next steps:"
echo "1. Verify the site on https://$DISTRIBUTION_DOMAIN_NAME"
echo "2. Update your registrar nameservers to the Route 53 nameservers above"
DOMAIN_NAME="$(jq -r '.context.environments.prod.domainName' infrastructure/cdk.json)"
echo "3. After propagation, verify https://$DOMAIN_NAME"
