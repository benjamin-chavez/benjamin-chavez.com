// src/components/hero.tsx

import Link from 'next/link';
import Image from 'next/image';
import { Container } from './container';
import BannerImage from '@/../public/img/Banner-image-cropped.png';

export default function Hero() {
  return (
    <section
      // text-transparent
      // bg-hero-image
      //
      className="relative -mt-14 min-h-screen w-full bg-cover bg-center bg-no-repeat"
    >
      <Image
        src={BannerImage}
        alt={''}
        className="absolute -z-10 aspect-auto h-full w-auto object-cover"
        priority
        placeholder="blur"
      />

      <Container
        // as="section"
        // id="home-section"
        // className="absolute bottom-0 h-full w-full bg-red-500 pb-12"
        className="absolute top-0 h-full w-full bg-gradient-to-b from-transparent to-black/70 pb-12"
      >
        <div className="absolute w-full bg-red-500 text-center">
          <h1 className="text-transparent md:text-white">
            <span className="font-dosis block text-7xl font-light uppercase tracking-[.45rem] ">
              Benjamin Chavez
            </span>
            <span className="font-open-sans mt-2 block text-base">
              Full Stack Developer
            </span>
          </h1>
        </div>
        <div className="mt-4 flex w-full justify-center gap-2">
          <Link
            href="/#portfolio"
            //
            className="font-open-sans flex h-10 w-[120px] items-center justify-center whitespace-nowrap rounded border border-white bg-[#00000036] text-center text-base text-white hover:bg-[#a7a7a736]"
          >
            Portfolio
          </Link>
          <Link
            href="/blog"
            //
            className="font-open-sans flex h-10 w-[120px] items-center justify-center whitespace-nowrap rounded border border-white bg-[#00000036] text-center text-base text-white hover:bg-[#a7a7a736]"
          >
            Blog
          </Link>
        </div>
      </Container>
    </section>
  );
}
