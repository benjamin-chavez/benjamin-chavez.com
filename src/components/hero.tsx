// src/components/hero.tsx

import Link from 'next/link';
import Image from 'next/image';
import { Container } from './container';
import BannerImage from '@/../public/img/Banner-image-cropped.png';

function HeroButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="font-open-sans flex h-[38px] w-[120px] items-center justify-center whitespace-nowrap rounded border border-white bg-[#00000036] text-center text-base text-white hover:bg-[#a7a7a736]"
    >
      {children}
    </Link>
  );
}

export default function Hero() {
  return (
    <section
      // bg-hero-image -mt-6
      // className="relative h-screen min-h-screen w-full bg-cover bg-fixed bg-center bg-no-repeat"
      id="home"
      className="bg-hero-image relative -mt-14 h-screen min-h-screen w-full bg-cover bg-fixed bg-center bg-no-repeat"
      // className="-mt-14 h-screen"
    >
      {/* <Image
        src={BannerImage}
        alt={''}
        className="absolute top-0 -z-20 aspect-auto h-full w-full bg-fixed object-cover"
        priority
        placeholder="blur"
      />
      <div
        // pb-12
        className="absolute top-0 -z-10 aspect-auto h-full w-full bg-gradient-to-b from-transparent to-black/70 "
      /> */}

      <div className="flex h-full items-end justify-center pb-16 text-white">
        <div className="flex flex-col items-center">
          <h1 className="font-dosis text-7xl font-light uppercase tracking-[.45rem] text-transparent md:text-white ">
            Benjamin Chavez
          </h1>
          <h2 className="font-open-sans mt-3 block text-base">
            Full Stack Developer
          </h2>

          <div className="mt-4 flex gap-9">
            <HeroButton href={'/#portfolio'}>Portfolio</HeroButton>
            <HeroButton href={'/blog'}>My Story</HeroButton>
          </div>
        </div>
      </div>
    </section>
  );
}
