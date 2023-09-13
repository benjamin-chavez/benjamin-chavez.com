// src/components/mdx.tsx
// import 'server-only';

import { useMDXComponent } from 'next-contentlayer/hooks';
import Image from 'next/image';
// import { cx } from 'cva.config';

import CodeCopyButton from './code-copy-button';
import CodeBlockTitle from './code-block-title';
import clsx from 'clsx';
import { cx } from 'cva.config';

type MdxComponentProps = {
  className: string;
};

const mdxComponents = {
  Image,
  h2: ({ className, ...props }: MdxComponentProps) => (
    <h2
      className={clsx(
        'mb-6 scroll-m-16 font-normal uppercase',
        'text-xl tracking-[.1rem] text-[#141414]',
        ' [&:not(:first-child)]:mt-16',
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: MdxComponentProps) => (
    <h3
      className={clsx(
        'scroll-m-16 font-dosis font-normal',
        'text-lg uppercase text-[#141414]',
        className,
      )}
      {...props}
    />
  ),
  // a: ({ className, ...props }: MdxComponentProps) => (
  a: ({ className, href, ...props }: MdxComponentProps & { href?: string }) => {
    const isExternalLink = href?.startsWith('http');
    return (
      <a
        href={href}
        className={cx(
          ' font-light text-neutral-900 underline transition-all hover:text-[#008000]',
          // 'decoration-neutral-400 decoration-[0.1em] underline-offset-2 transition-all'
          className,
        )}
        {...props}
        // target={isExternalLink ? '_blank' : '_self'}
        // rel={isExternalLink ? 'noopener noreferrer' : undefined}
      />
    );
  },
  strong: ({ className, ...props }: MdxComponentProps) => (
    <strong
      className={clsx(
        'font-open-sans text-[0.94rem] font-normal text-neutral-600',
        className,
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }: MdxComponentProps) => (
    <p
      className={clsx(
        'font-open-sans text-[0.94rem] font-light text-[#777777] ',
        className,
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }: any) => (
    <pre
      // !bg-transparent
      className={clsx(
        'px-0',
        'group relative m-0 overflow-x-auto rounded-md py-4',
        // '!bg-transparent',
        className,
      )}
      {...props}
    >
      <CodeCopyButton text={props.__rawstring__} />
      {props.children}
    </pre>
  ),

  code: ({ className, ...props }: any) => (
    <code
      className={cx(
        // 'relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm',
        'font-mono text-sm',
        className,
      )}
      {...props}
    />
  ),
  CodeBlockTitle,
};

interface MdxProps {
  code: string;
  className?: string;
}

export function Mdx({ code, className }: MdxProps) {
  const Component = useMDXComponent(code);

  return (
    <div className={clsx('', className)}>
      <article className=" prose max-w-none pb-20 prose-code:before:content-none prose-code:after:content-none">
        {/* <article className="prose max-w-none"> */}
        {/* @ts-ignore */}

        <Component components={{ ...mdxComponents }} />
      </article>
    </div>
  );
}
