// src/components/container.tsx

import { cx } from '../../cva.config';

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
      className={cx(
        'mx-auto max-w-3xl px-5 md:px-4',
        className,
        //
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
