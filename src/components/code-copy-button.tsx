// src/components/code-copy-button.tsx

'use client';

import { cx } from 'cva';
import { useState } from 'react';

const CodeCopyButton = ({
  text,
  isTitle = false,
}: {
  text: string;
  isTitle?: boolean;
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  // if (text !== undefined) {
  return (
    <>
      <button
        disabled={isCopied}
        onClick={copy}
        aria-label="Copy code"
        type="button"
        className={cx(
          'ease flex h-9 w-9  items-center justify-center rounded-md p-1 transition-all duration-200 hover:bg-red-400/30',
          isCopied
            ? 'border-green-400 focus:border-green-400 focus:outline-none'
            : 'border-gray-300',
          isTitle
            ? ''
            : 'absolute right-3 top-3 z-50 opacity-0 group-hover:opacity-100',
        )}
      >
        {isCopied ? (
          <svg
            data-testid="geist-icon"
            fill="none"
            height="20"
            shapeRendering="geometricPrecision"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            width="20"
          >
            <path d="M20 6L9 17l-5-5"></path>
          </svg>
        ) : (
          <svg
            data-testid="geist-icon"
            fill="none"
            height="20"
            shapeRendering="geometricPrecision"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            width="20"
          >
            <path d="M6 17C4.89543 17 4 16.1046 4 15V5C4 3.89543 4.89543 3 6 3H13C13.7403 3 14.3866 3.4022 14.7324 4M11 21H18C19.1046 21 20 20.1046 20 19V9C20 7.89543 19.1046 7 18 7H11C9.89543 7 9 7.89543 9 9V19C9 20.1046 9.89543 21 11 21Z"></path>
          </svg>
        )}
      </button>
    </>
  );
  // }
};

export default CodeCopyButton;
