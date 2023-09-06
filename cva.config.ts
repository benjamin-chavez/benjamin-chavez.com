// cva.config.ts

import { defineConfig } from 'cva';
import { twMerge } from 'tailwind-merge';

export const { cva, cx, compose } = defineConfig({
  hooks: {
    onComplete: (className) => twMerge(className),
  },
  // hooks: {
  //   'cx:done': (className) => twMerge(className),
  // },
});
