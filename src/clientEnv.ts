import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.url().default('http://localhost:3000'),
  NEXT_PUBLIC_CF_ANALYTICS_TOKEN: z.string().optional(),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || undefined,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || undefined,
  NEXT_PUBLIC_CF_ANALYTICS_TOKEN:
    process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN || undefined,
});

if (!parsed.success) {
  console.error('❌ Invalid environment variables:\n' + z.prettifyError(parsed.error));
  throw new Error('Invalid environment variables');
}

export const clientEnv = parsed.data;
