// src/components/mdx.tsx

'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useMDXComponent } from 'next-contentlayer/hooks';

import clsx from 'clsx';
import { Container } from './container';
import { CopyButton } from './copy-button';
import Pre from './pre';
import CodeTitle from './code-title';
import Pre2 from './pre2';
import { cx } from 'cva.config';

type MdxComponentProps = {
  className: string;
};

const mdxComponents = {
  CodeTitle,
  Image,
  pre2: Pre2,
  pre: Pre,
  h2: ({ className, ...props }: MdxComponentProps) => (
    <h2
      className={cx(
        // 'mt-10 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0',
        // text-gray-500
        // 'pt-2 font-open-sans text-[0.94rem] font-light  text-[#777777]',
        // mt-3  block
        'font-open-sans text-base font-normal',
        className,
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }: MdxComponentProps) => (
    <p
      // className={cx('leading-7 [&:not(:first-child)]:mt-6', className)}
      // [&:not(:first-child)]:mt-6
      className={cx(
        'font-open-sans text-[0.94rem] font-light text-[#777777] ',
        className,
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }: MdxComponentProps) => (
    <code
      className={cx(
        // 'relative rounded border px-[0.3rem] py-[0.2rem] font-mono text-sm',
        'text-sm',
        // 'text-[0.813rem]',
        className,
      )}
      {...props}
    />
  ),
};

interface MdxProps {
  code: string;
}

export function Mdx({ code }: MdxProps) {
  const Component = useMDXComponent(code);

  return (
    <div className="">
      <article
        // className="mdx"
        // className="prose prose-quoteless  mx-auto "
        className=" prose max-w-none"
      >
        {/* @ts-ignore */}
        <Component components={{ ...mdxComponents }} />
      </article>
    </div>
  );
}
