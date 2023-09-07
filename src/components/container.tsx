// src/components/container.tsx

import { Component } from 'react';
import { cx, cva } from '../../cva.config';

type ContainerProps = {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  children: React.ReactNode;
  [x: string]: any;
};

export function Container({
  as: Component = 'div',
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Component
      // bg-orange-500/10
      className={cx('mx-auto max-w-7xl px-6 lg:px-8', className)}
      {...props}
    >
      <div
        // bg-blue-500/20
        className="mx-auto max-w-2xl lg:max-w-none"
      >
        {children}
      </div>
    </Component>
  );
}
