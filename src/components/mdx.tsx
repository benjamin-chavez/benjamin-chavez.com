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
        'mb-6  font-normal uppercase',
        'text-xl tracking-[.1rem] text-[#141414]',
        ' [&:not(:first-child)]:mt-16',
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: MdxComponentProps) => (
    <h3
      className={cx(
        ' font-dosis font-normal',
        'text-lg uppercase text-[#141414]',
        className,
      )}
      {...props}
    />
  ),
  a: ({ className, ...props }: MdxComponentProps) => (
    <a
      className={cx(
        'font-light text-neutral-900 underline transition-all hover:text-[#008000]',
        className,
      )}
      {...props}
      target="_blank"
      rel="noopener noreferrer"
    />
  ),
  strong: ({ className, ...props }: MdxComponentProps) => (
    <strong
      className={cx(
        'font-open-sans text-[0.94rem] font-normal text-neutral-600',
        className,
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }: MdxComponentProps) => (
    <p
      className={cx(
        'font-open-sans text-[0.94rem] font-light text-[#777777] ',
        className,
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }: MdxComponentProps) => (
    <code className={cx('font-mono text-sm', className)} {...props} />
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
      <article className=" prose max-w-none  pb-20 prose-code:before:content-none prose-code:after:content-none">
        {/* @ts-ignore */}
        <Component components={{ ...mdxComponents }} />
      </article>
    </div>
  );
}
