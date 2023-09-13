// src/app/blog/[slug]/page.tsx

import 'server-only';

import { Container } from '@/components/container';
import { Mdx } from '@/components/mdx';
import { formatDate } from '@/lib/utils';
import { allBlogs } from 'contentlayer/generated';
import { cx } from 'cva.config';
import Link from 'next/link';
import { notFound } from 'next/navigation';

function getPost(params: any) {
  return allBlogs.find((post) => post.slug === params.slug);
}

export async function generateMetadata({
  // @ts-ignore
  params,
  // @ts-ignore
}): Promise<Metadata | undefined> {
  const post = allBlogs.find((post) => post.slug === params.slug);
  if (!post) {
    return;
  }

  const {
    title,
    publishedAt: publishedTime,
    summary: description,
    // image,
    slug,
  } = post;
  // const ogImage = image
  //   ? `https://benjamin-chavez.com${image}`
  //   : `https://benjamin-chavez.com/og?title=${title}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `https://benjamin-chavez.com/blog/${slug}`,
      // images: [
      //   {
      //     url: ogImage,
      //   },
      // ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      // images: [ogImage],
    },
  };
}

function BackButton({ className }: { className?: string }) {
  return (
    <div className={cx('group w-fit px-0', className)}>
      <Link
        href="/blog"
        // font-semibold
        className="flex items-center justify-center "
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
          // duration-100 ease-in group-hover:-translate-x-1 group-hover:fill-[#889397]/70
          className="ml-0 fill-[#889397] duration-100 ease-in group-hover:-translate-x-[.15rem] group-hover:fill-[#889397]/70"
          aria-hidden="true"
        >
          <path d="M12.9999 6.83211L6.05548 6.83211L7.59049 5.2971C7.98101 4.90657 7.98101 4.27341 7.59049 3.88288L7.35157 3.64397C6.96105 3.25344 6.32788 3.25344 5.93736 3.64397L2.55473 7.0266C2.5455 7.03516 2.53639 7.04394 2.52742 7.05291L2.2885 7.29183C1.89797 7.68235 1.89797 8.31552 2.2885 8.70604L5.93965 12.3572C6.33017 12.7477 6.96334 12.7477 7.35386 12.3572L7.59278 12.1183C7.9833 11.7278 7.9833 11.0946 7.59278 10.7041L6.0587 9.16998L12.9999 9.16998C13.5522 9.16998 13.9999 8.72227 13.9999 8.16998V7.83211C13.9999 7.27982 13.5522 6.83211 12.9999 6.83211Z" />
        </svg>
        <span
          //
          className=" pl-1 font-open-sans text-[15px]"
        >
          Back
        </span>
      </Link>
    </div>
  );
}

interface BlogProps {
  params: {
    slug: string;
  };
}

export default async function Blog({ params }: BlogProps) {
  const post = getPost(params);

  if (!post) {
    notFound();
  }

  return (
    <>
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

          <div
            // text-gray-800
            className=" -ml-1 w-fit rounded-md !bg-[#83a06c] !bg-opacity-50 px-1.5 py-1 font-open-sans !text-[#008000] md:ml-0"
          >
            Last Updated:{' '}
            <time
              dateTime={post.publishedAt}
              // text-gray-500
              className="font-open-sans text-[#008000]"
            >
              {formatDate(post.updatedAt)}
            </time>
          </div>
        </div>

        <section className="my-16 flex flex-col">
          <Mdx code={post?.body.code} />
        </section>
      </Container>
    </>
  );
}
