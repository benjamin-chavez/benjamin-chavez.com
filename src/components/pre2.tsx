'use client';

import React from 'react';
import { SiTypescript } from 'react-icons/si';
import { CopyButton } from './copy-button';

interface IPre extends React.HTMLAttributes<HTMLPreElement> {
  className?: string;
}
export default function Pre2({ className, ...props }: IPre) {
  const textInput = React.useRef<HTMLDivElement>(null);

  let Icon = SiTypescript;

  return (
    <div ref={textInput} className="relative w-full ">
      <CopyButton textInput={textInput} />
      <pre
        // bg-[#030314]
        className="mb-0 mt-8 items-center rounded-b-none !bg-black"
        {...props}
      >
        <div className=" flex items-center gap-2 overflow-hidden truncate">
          {' '}
          <Icon className="h-3.5 w-3.5 flex-shrink-0 items-center  " />
          <span className="truncate pr-10">{props.title}</span>
        </div>
      </pre>
    </div>
  );
}
