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
            <h1 className="font-dosis text-center text-7xl font-light uppercase tracking-[.45rem] text-[#141414] ">
              {post.title}
            </h1>
            {/* <p className="mt-2 text-lg leading-8 text-gray-600">
              Technical articles covering my experiences as a software engineer
            </p> */}
            <section>
              <Container className="mt-18 tablet:mt-24 flex flex-col">
                <div className="mobile-md:px-6 tab-pro:px-14 laptop:px-8 desktop:px-[40px] rounded-3xl bg-white/[.68] px-4 py-6 shadow-sm backdrop-blur-[23px]">
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
