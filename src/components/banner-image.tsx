// src/components/banner-image.tsx
'use client';

import { CldImage } from 'next-cloudinary';
import Image from 'next/image';
import BannerImg from '../../public/img/Banner-image-cropped.webp';

export default function BannerImage() {
  return (
    <div>
      {/* <Image
        src={BannerImg}
        alt="Benjamin Chavez"
        className="absolute top-0 -z-20 aspect-auto h-full w-full object-cover md:fixed  lg:top-0 xl:top-4 2xl:top-9"
        priority
        quality={100}
        placeholder="blur"
      /> */}
      <CldImage
        width="3000"
        height="657"
        className="absolute top-0 -z-20 aspect-auto h-full w-full object-cover md:fixed  lg:top-0 xl:top-4 2xl:top-9"
        src="Banner-image-cropped_fiuipi"
        alt={'Benjamin Chavez Full Stack Developer'}
        sizes="100vw"
        format="avif"
        // loading="lazy"
        // sizes="(min-width: 3000px ) 50vw,
        //        (min-width: 3000px) 33vw,
        //        (min-width: 3000px) 25vw,
        //        100vw"
      />
    </div>
  );
}
