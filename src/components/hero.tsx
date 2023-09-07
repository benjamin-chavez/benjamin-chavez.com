// src/components/hero.tsx

import Link from 'next/link';
import Image from 'next/image';
import { Container } from './container';
import BannerImage from '@/../public/img/Banner-image-cropped.png';

export default function Hero() {
  return (
    <section className="bg-hero-image relative -mt-6 h-screen min-h-screen w-full bg-cover bg-fixed bg-center bg-no-repeat">
      {/* <Image
        src={BannerImage}
        alt={''}
        className="absolute top-0 -z-20 aspect-auto h-full w-full bg-fixed  object-cover"
        priority
        placeholder="blur"
      />
      <div className="absolute top-0 -z-10 h-full w-full bg-gradient-to-b from-transparent to-black/70 pb-12 " /> */}
      {/* <div className="h-full w-full bg-red-500"> */}
      <div
        // as="section"
        // id="home-section"
        // className="absolute bottom-0 h-full w-full bg-red-500 pb-12"
        // className="absolute top-0 h-full w-full bg-green-500 bg-gradient-to-b from-transparent to-black/70 pb-12"
        className="flex h-full w-full flex-col justify-end"
      >
        <div className="  text-center">
          <h1 className="text-transparent md:text-white">
            <span className="font-dosis block text-7xl font-light uppercase tracking-[.45rem] ">
              Benjamin Chavez
            </span>
            <span className="font-open-sans mt-2 block text-base">
              Full Stack Developer
            </span>
          </h1>

          <div
            // w-full
            className="mt-4 flex  justify-center gap-8"
          >
            <div>
              <Link
                href="/#portfolio"
                //
                className="font-open-sans flex h-10 w-[120px] items-center justify-center whitespace-nowrap rounded border border-white bg-[#00000036] text-center text-base text-white hover:bg-[#a7a7a736]"
              >
                Portfolio
              </Link>
            </div>
            <div>
              <Link
                href="/blog"
                //
                className="font-open-sans flex h-10 w-[120px] items-center justify-center whitespace-nowrap rounded border border-white bg-[#00000036] text-center text-base text-white hover:bg-[#a7a7a736]"
              >
                Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </section>
  );
}
