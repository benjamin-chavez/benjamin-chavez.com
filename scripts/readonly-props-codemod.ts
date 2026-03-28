// scripts/readonly-props-codemod.ts — jscodeshift codemod
// Wraps inline component prop type annotations with Readonly<>
//
// Usage:
//   pnpm add -D jscodeshift @types/jscodeshift
//   npx jscodeshift --parser tsx --transform scripts/readonly-props-codemod.ts --dry --print src/**/*.tsx
//   npx jscodeshift --parser tsx --transform scripts/readonly-props-codemod.ts src/**/*.tsx

import type { API, FileInfo } from 'jscodeshift';

export default function transform(file: FileInfo, api: API) {
  const j = api.jscodeshift;
  const root = j(file.source);
  let changed = false;

  // Find function declarations/expressions with destructured object params
  // that have a type annotation not already wrapped in Readonly
  root
    .find(j.ObjectPattern)
    .filter((path) => {
      const typeAnnotation = path.value.typeAnnotation;
      if (!typeAnnotation) return false;

      const annotation = typeAnnotation.typeAnnotation;
      // Skip if already Readonly<...>
      if (
        annotation.type === 'TSTypeReference' &&
        annotation.typeName.type === 'Identifier' &&
        annotation.typeName.name === 'Readonly'
      ) {
        return false;
      }
      return true;
    })
    .forEach((path) => {
      const annotation = path.value.typeAnnotation.typeAnnotation;
      // Wrap the existing type in Readonly<ExistingType>
      path.value.typeAnnotation.typeAnnotation = j.tsTypeReference(
        j.identifier('Readonly'),
        j.tsTypeParameterInstantiation([annotation]),
      );
      changed = true;
    });

  return changed ? root.toSource() : undefined;
}
