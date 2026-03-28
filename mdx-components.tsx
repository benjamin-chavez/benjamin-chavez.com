import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
import clsx from 'clsx';
import { cx } from 'cva.config';
import CodeBlockTitle from '@/components/code-block-title';
import CodeCopyButton from '@/components/code-copy-button';

export function useMDXComponents(): MDXComponents {
  return {
    h2: ({ className, ...props }: any) => (
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
    h3: ({ className, ...props }: any) => (
      <h3
        className={clsx(
          'scroll-m-16 font-dosis font-normal',
          'text-lg uppercase text-[#141414]',
          className,
        )}
        {...props}
      />
    ),
    a: ({ className, href, ...props }: any) => {
      const isExternal = href?.startsWith('http');
      const isNoFollowLink = href?.startsWith('http://localhost:');

      return (
        <a
          href={href}
          className={cx(
            'font-light text-neutral-900 underline transition-all hover:text-[#008000]',
            className,
          )}
          target={isExternal ? '_blank' : '_self'}
          rel={
            isNoFollowLink
              ? 'nofollow'
              : isExternal
              ? 'noopener noreferrer'
              : undefined
          }
          {...props}
        />
      );
    },
    strong: ({ className, ...props }: any) => (
      <strong
        className={clsx(
          'font-open-sans text-[0.94rem] font-normal text-neutral-600',
          className,
        )}
        {...props}
      />
    ),
    p: ({ className, ...props }: any) => (
      <p
        className={clsx(
          'font-open-sans text-[0.94rem] font-light text-[#777777] ',
          className,
        )}
        {...props}
      />
    ),
    ul: ({ className, ...props }: any) => (
      <ul
        className={cx(
          'list-disc font-open-sans text-[0.94rem] text-[#777777]',
          className,
        )}
        {...props}
      />
    ),
    ol: ({ className, ...props }: any) => (
      <ol
        className={cx(
          'list-decimal font-open-sans text-[0.94rem] text-[#777777]',
          className,
        )}
        {...props}
      />
    ),
    li: ({ className, ...props }: any) => (
      <li
        className={cx(
          'mt-2 font-open-sans text-[0.94rem] font-light text-[#777777]',
          className,
        )}
        {...props}
      />
    ),
    Callout: (props: any) => (
      <div className="my-8 flex items-center rounded border border-gray-200 bg-[#F8F9FA] px-4 py-2 text-sm text-[#777777]">
        {props.emoji && (
          <div className="mr-4 flex w-4 items-center">{props.emoji}</div>
        )}
        <div className="w-full">{props.children}</div>
      </div>
    ),
    pre: (props: any) => (
      <pre
        className={clsx(
          'px-0',
          'group relative m-0 overflow-x-auto rounded-md py-4',
          props.className,
        )}
        {...props}
      >
        <CodeCopyButton text={props.__rawstring__} />
        {props.children}
      </pre>
    ),
    code: ({ className, ...props }: any) => (
      <code className={cx('font-mono text-sm', className)} {...props} />
    ),
    Image: (props: any) => (
      <div className="flex w-full justify-center">
        <Image alt={props.alt} className="rounded-md" {...props} quality={100} />
      </div>
    ),
    CodeBlockTitle,
  };
}
