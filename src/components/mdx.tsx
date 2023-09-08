// src/components/mdx.tsx

'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useMDXComponent } from 'next-contentlayer/hooks';

import clsx from 'clsx';
import { Container } from './container';

const mdxComponents = {
  Image,
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
        <Component components={{ ...mdxComponents }} />
      </article>
    </Container>
  );
}
