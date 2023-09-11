// src/components/mdx.tsx
import 'server-only';

import { useMDXComponent } from 'next-contentlayer/hooks';
import Image from 'next/image';
import Pre from './pre';

import { cx } from 'cva.config';
import Pre2 from './pre2';

type MdxComponentProps = {
  className: string;
};

const mdxComponents = {
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
        'font-open-sans text-base font-bold',
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: MdxComponentProps) => (
    <h2
      className={cx(
        // 'mt-10 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0',
        // text-gray-500
        // 'pt-2 font-open-sans text-[0.94rem] font-light  text-[#777777]',
        // mt-3  block
        'font-open-sans text-base font-semibold',
        className,
      )}
      {...props}
    />
  ),
  a: ({ className, ...props }: MdxComponentProps) => (
    <a
      className={cx(
        // 'font-medium underline underline-offset-4',
        'font-light text-neutral-900 underline transition-all hover:text-[#008000]',
        className,
      )}
      {...props}
      target="_blank"
      rel="noopener noreferrer"
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
        'font-mono text-sm',
        // 'text-[0.813rem]',
        className,
      )}
      {...props}
    />
  ),
};

interface MdxProps {
  code: string;
  className?: string;
}

export function Mdx({ code, className }: MdxProps) {
  const Component = useMDXComponent(code);

  return (
    <div className={cx('', className)}>
      <article
        // className="mdx"
        // className="prose prose-quoteless  mx-auto "
        className=" prose max-w-none pb-20 prose-code:before:content-none prose-code:after:content-none "
      >
        {/* @ts-ignore */}
        <Component components={{ ...mdxComponents }} />
      </article>
    </div>
  );
}
