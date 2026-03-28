#!/usr/bin/env bash

# scripts/cleanup.sh

# Navigate to the repo's root directory
cd "$(dirname "$0")/.." || exit 1

# Find and delete old directories
find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
find . -name "dist" -type d -prune -exec rm -rf '{}' +
find . -name "out" -type d -prune -exec rm -rf '{}' +
find . -name ".turbo" -type d -prune -exec rm -rf '{}' +
find . -name ".next" -type d -prune -exec rm -rf '{}' +
find . -name "cdk.out" -type d -prune -exec rm -rf '{}' +

# Verification step to display any remaining matching directories/files
remaining_items=$(find . \( \
  -name "node_modules" -o \
  -name "dist" -o \
  -name ".turbo" -o \
  -name ".next" -o \
  -name "cdk.out" \
\) -type d)

# Check if any remaining items were found/failed deletion
if [[ -n "$remaining_items" ]]; then
  echo "The following directories were not deleted:"
  echo "$remaining_items"
else
  echo "Cleanup complete."
fi