// src/components/container.tsx

import { Component } from 'react';
import { cx, cva } from '../../cva.config';

type ContainerProps = {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  children: React.ReactNode;
};

export function Container({
  as: Component = 'div',
  className,
  children,
}: ContainerProps) {
  return (
    <Component
      className={cx('mx-auto max-w-7xl bg-orange-500 px-6 lg:px-8', className)}
    >
      <div className="mx-auto max-w-2xl bg-blue-500/20 lg:max-w-none">
        {children}
      </div>
    </Component>
  );
}
