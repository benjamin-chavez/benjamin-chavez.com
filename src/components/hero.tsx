// src/components/hero.tsx

import 'server-only';
// 'use client';
// import BannerImage from '@/../public/img/Banner-image-cropped.png';
import Link from 'next/link';
import BannerImage from './banner-image';

function HeroButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    //  "duration-600 transition ease-in-out group-hover:bg-black/80"

    <Link
      href={href}
      className="flex h-[38px] w-[120px] items-center justify-center whitespace-nowrap rounded border border-white bg-[#00000036] text-center font-open-sans text-base text-white transition duration-300 ease-in-out hover:bg-[#a7a7a736] "
    >
      {children}
    </Link>
  );
}

export default function Hero() {
  return (
    <section
      id="home"
      className=" relative -mt-14 h-screen min-h-screen w-full bg-cover bg-fixed bg-center bg-no-repeat"
    >
      <BannerImage />

      <div className="absolute top-0 -z-10 aspect-auto h-full w-full bg-gradient-to-b from-transparent to-black/70 md:fixed" />
      <div className="flex h-full items-end justify-center pb-16 text-white">
        <div className="flex flex-col items-center">
          <h1 className="font-dosis text-7xl font-light uppercase tracking-[.45rem] text-transparent md:text-white ">
            Benjamin Chavez
          </h1>
          <h2 className="mt-3 block font-open-sans text-base">
            Full Stack Developer
          </h2>

          <div className="mt-4 flex gap-9">
            <HeroButton href={'/#portfolio'}>Portfolio</HeroButton>
            <HeroButton href={'/#contact'}>Contact</HeroButton>
          </div>
        </div>
      </div>
    </section>
  );
}
