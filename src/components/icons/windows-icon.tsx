// src/components/icons/windows-icon.tsx

import { cx } from '../../../cva.config';

export default function WindowsIcon({
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
      <title>Windows Logo</title>
      <desc>Icon representing the Windows operating system.</desc>
      <path
        // fill="#00ADEF"
        d="M126 1.637l-67 9.834v49.831l67-.534zM1.647 66.709l.003 42.404 50.791 6.983-.04-49.057zm56.82.68l.094 49.465 67.376 9.509.016-58.863zM1.61 19.297l.047 42.383 50.791-.289-.023-49.016z"
      ></path>
    </svg>
  );
}
