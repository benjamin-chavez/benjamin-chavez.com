// src/buildEnv.ts
import 'server-only';

import { z } from 'zod';

const envSchema = z.object({
  AWS_REGION: z.string().default('us-east-2'),
});

const parsed = envSchema.safeParse({
  AWS_REGION: process.env.AWS_REGION || undefined,
});

if (!parsed.success) {
  console.error(
    '❌ Invalid build environment variables:\n' + z.prettifyError(parsed.error),
  );
  throw new Error('Invalid build environment variables');
}

export const buildEnv = parsed.data;
