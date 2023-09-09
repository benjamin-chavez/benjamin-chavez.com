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
      // className={cx(' max-w-7xl px-6 lg:px-8', className)}
      // sm:px-6 lg:px-8 mx-auto sm:max-w-7xl
      className={cx(
        // 'mx-auto w-screen max-w-3xl px-2',
        'mx-auto  max-w-3xl px-2',
        className,
        //
      )}
      {...props}
    >
      <div
        // bg-blue-500/20 mx-auto max-w-2xl lg:max-w-none
        className="bg-red-500/50 sm:bg-yellow-500/50 md:bg-green-500/50 lg:bg-green-500/50 xl:bg-blue-500/50"
      >
        {children}
      </div>
    </Component>
  );
}
