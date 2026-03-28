// src/components/icons/template-icon.tsx

import { cx } from '../../../cva.config';
import React from 'react';

export default function TemplateIcon({
  className,
  props,
}: Readonly<{
  className?: string;
  props?: React.SVGProps<SVGSVGElement>;
}>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      fill="currentColor"
      aria-hidden="true"
      role="img"
      className={cx('h-4', className)}
      {...props}
    >
      {/* TODO: */}
    </svg>
  );
}
