import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_CF_ANALYTICS_TOKEN: z.string().optional(),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_CF_ANALYTICS_TOKEN: process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN,
});
