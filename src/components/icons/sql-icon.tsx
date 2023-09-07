// src/components/icons/sql-icon.tsx




import { cx } from '../../../cva.config';

export default function SqlIcon({
  className,
  props,
}: {
  className?: string;
  props?: any;
}) {
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

  );
}
