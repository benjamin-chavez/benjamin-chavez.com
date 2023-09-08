// src/app/blog/[slug]/page.tsx

// import 'server-only';

import { allBlogs } from 'contentlayer/generated';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Container } from '@/components/container';
import { Mdx } from '@/components/mdx';
// import { formatDate } from '@/app/lib/utils';

function getPost(params: any) {
  return allBlogs.find((post) => post.slug === params.slug);
}

// export async function generateMetadata({
//   params,
// }: any): Promise<Metadata | undefined> {
//   const post = getPost(params);

//   if (!post) {
//     return;
//   }

//   // TODO: double check the `publishedAt` meta data
//   const {
//     title,
//     publishedAt: publishedTime,
//     summary: description,
//     slug,
//   } = post;

//   return {
//     title,
//     description,
//     openGraph: {
//       title,
//       description,
//       type: 'article',
//       publishedTime,
//       url: `https://ctrl-f.plus/blog/${slug}`,
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title,
//       description,
//     },
//   };
// }

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
      <div className="bg-[#ECEDFA] py-12 sm:py-12">
        <div className="mx-auto flex max-w-7xl   px-6 lg:px-8">
          <div
            // max-w-6xl
            className="mx-auto flex flex-col items-center justify-center "
          >
            <div className="mt-18 w-full  ">
              <Link
                href="/blog"
                className="flex items-center px-2 font-semibold"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-[#889397] duration-100 ease-in group-hover:-translate-x-1 group-hover:fill-[#889397]/70"
                  aria-hidden="true"
                >
                  <path d="M12.9999 6.83211L6.05548 6.83211L7.59049 5.2971C7.98101 4.90657 7.98101 4.27341 7.59049 3.88288L7.35157 3.64397C6.96105 3.25344 6.32788 3.25344 5.93736 3.64397L2.55473 7.0266C2.5455 7.03516 2.53639 7.04394 2.52742 7.05291L2.2885 7.29183C1.89797 7.68235 1.89797 8.31552 2.2885 8.70604L5.93965 12.3572C6.33017 12.7477 6.96334 12.7477 7.35386 12.3572L7.59278 12.1183C7.9833 11.7278 7.9833 11.0946 7.59278 10.7041L6.0587 9.16998L12.9999 9.16998C13.5522 9.16998 13.9999 8.72227 13.9999 8.16998V7.83211C13.9999 7.27982 13.5522 6.83211 12.9999 6.83211Z" />
                </svg>
                <span className="pl-1"> back</span>
              </Link>
            </div>

            <h1 className="font-dosis text-center text-7xl font-light uppercase tracking-[.45rem] text-[#141414] ">
              {post.title}
            </h1>
            {/* <p className="mt-2 text-lg leading-8 text-gray-600">
              Technical articles covering my experiences as a software engineer
            </p> */}

            <section>
              <Container className="mt-18 tablet:mt-24 flex flex-col">
                <div
                  // bg-white/[.68]
                  className="mobile-md:px-6 tab-pro:px-14 laptop:px-8 desktop:px-[40px] rounded-3xl  px-4 py-6 shadow-sm backdrop-blur-[23px]"
                >
                  <Mdx code={post?.body.code} />
                </div>
              </Container>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
