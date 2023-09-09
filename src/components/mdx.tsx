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

const mdxComponents = {
  CodeTitle,
  Image,
  pre2: Pre2,
  pre: Pre,
  // pre: ({ className, ...props }: any) => {
  //   console.log(props);

  //   return (
  //     <pre
  //       className={clsx(
  //         'mb-4 mt-6 overflow-x-auto rounded-lg border bg-black py-4',
  //         className,
  //       )}
  //       {...props}
  //     />
  //   );
  // },
};

interface MdxProps {
  code: string;
}

export function Mdx({ code }: MdxProps) {
  const Component = useMDXComponent(code);

  return (
    <Container className="">
      <article
        // className="mdx"
        // className="prose prose-quoteless prose-neutral mx-auto "
        className="prose max-w-none"
      >
        {/* @ts-ignore */}
        <Component components={{ ...mdxComponents }} />
      </article>
    </Container>
  );
}
