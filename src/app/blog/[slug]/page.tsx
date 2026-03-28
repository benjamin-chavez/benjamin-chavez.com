// src/app/blog/[slug]/page.tsx

import 'server-only';

import { Container } from '@/components/container';
import { formatDate } from '@/lib/utils';
import { getPublishedPosts, getPostBySlug } from '@/lib/posts';
import { cx } from 'cva.config';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import '@/styles/mdx.css';

export function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata | undefined> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return;

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: post.publishedAt,
      url: `https://benjamin-chavez.com/blog/${slug}/`,
      images: [{ url: `/og/${slug}.png` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: [`/og/${slug}.png`],
    },
  };
}

function BackButton({ className }: { className?: string }) {
  return (
    <div className={cx('group w-fit px-0', className)}>
      <Link href="/blog" className="flex items-center justify-center ">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
          className="ml-0 fill-[#889397] duration-100 ease-in group-hover:-translate-x-[.15rem] group-hover:fill-[#889397]/70"
          aria-hidden="true"
        >
          <path d="M12.9999 6.83211L6.05548 6.83211L7.59049 5.2971C7.98101 4.90657 7.98101 4.27341 7.59049 3.88288L7.35157 3.64397C6.96105 3.25344 6.32788 3.25344 5.93736 3.64397L2.55473 7.0266C2.5455 7.03516 2.53639 7.04394 2.52742 7.05291L2.2885 7.29183C1.89797 7.68235 1.89797 8.31552 2.2885 8.70604L5.93965 12.3572C6.33017 12.7477 6.96334 12.7477 7.35386 12.3572L7.59278 12.1183C7.9833 11.7278 7.9833 11.0946 7.59278 10.7041L6.0587 9.16998L12.9999 9.16998C13.5522 9.16998 13.9999 8.72227 13.9999 8.16998V7.83211C13.9999 7.27982 13.5522 6.83211 12.9999 6.83211Z" />
        </svg>
        <span className=" pl-1 font-open-sans text-[15px]">Back</span>
      </Link>
    </div>
  );
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { default: PostContent } = await import(`@/content/${slug}.mdx`);

  return (
    <Container className="relative py-9">
      <BackButton className={'pb-9'} />

      <h1 className=" font-dosis text-3xl uppercase leading-9 tracking-[.4rem] text-[#141414] ">
        {post.title}
      </h1>

      <div className="mt-2" />

      <div className="flex flex-col justify-start gap-x-3 gap-y-2 font-open-sans text-[15px] text-xs sm:flex-row sm:items-center">
        <div className=" ">
          <time
            dateTime={post.publishedAt}
            className="font-open-sans text-gray-500"
          >
            {formatDate(post.publishedAt)} / {post.readingTime.text}
          </time>
        </div>

        <div className=" -ml-1 w-fit rounded-md !bg-[#83a06c] !bg-opacity-50 px-1.5 py-1 font-open-sans !text-[#008000] md:ml-0">
          Last Updated:{' '}
          <time
            dateTime={post.updatedAt}
            className="font-open-sans text-[#008000]"
          >
            {formatDate(post.updatedAt)}
          </time>
        </div>
      </div>

      <section className="my-16 flex flex-col">
        <article className=" prose mx-auto max-w-none pb-20 prose-code:before:content-none prose-code:after:content-none ">
          <PostContent />
        </article>
      </section>
    </Container>
  );
}
