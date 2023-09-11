/* eslint-disable @next/next/no-img-element */
// src/app/blog/page.tsx

import { Container } from '@/components/container';
import { formatDate } from '@/lib/utils';
import { allBlogs } from 'contentlayer/generated';
import Link from 'next/link';

export default function Blog() {
  const publicPosts = allBlogs
    .filter(
      (post) =>
        new Date(post.publishedAt) <= new Date() ||
        process.env.NODE_ENV === 'development',
    )
    .sort((a, b) => {
      if (new Date(a.publishedAt) > new Date(b.publishedAt)) {
        return -1;
      }
      return 1;
    });

  return (
    <
      // py-4
      // className=""
    >
      <Container
        // bg-[#ECEDFA] bg-red-500
        // className="py-12 sm:py-12"
        className="px-3 py-9 md:px-2"
      >
        <div
          // mt-12
          className=""
        >
          <h1
            // pt-6
            className="px-2 text-center font-dosis text-3xl uppercase leading-9 tracking-[.4rem] text-[#141414]"
          >
            {/* My Story */}
            Blog
            {/* HOW TO CREATE A NEW EXPRESS APPLICATION */}
          </h1>
          <p className="mt-2 text-center text-lg leading-8 text-gray-600">
            Technical articles covering my experiences as a software engineer
          </p>
          <div
            // border-t border-gray-300
            // pt-10
            className="mt-6 space-y-16 "
          >
            {publicPosts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.slug}>
                <article
                  // -mx-2
                  className="ease  group mb-4 flex flex-col items-start justify-between rounded px-2 py-4 transition duration-200 hover:bg-black/10"
                >
                  <div className="flex items-center text-xs">
                    <time
                      dateTime={post.publishedAt}
                      className="font-open-sans text-gray-500"
                    >
                      {formatDate(post.publishedAt)}
                    </time>
                  </div>
                  <div className="relative ">
                    <h3 className="mt-3 text-lg uppercase leading-6 text-gray-900 group-hover:text-gray-600">
                      <span className="absolute inset-0" />
                      {post.title}
                    </h3>
                    <p
                      // classNamtext-neutral-00sans mt-3 line-clamp-3 text-sm leading-6 text-gray-600 "
                      className="mt-3 break-inside-avoid-column font-open-sans text-[15px] font-light text-neutral-500"
                    >
                      {post.description}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
