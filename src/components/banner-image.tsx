// src/components/banner-image.tsx
'use client';

import { CldImage } from 'next-cloudinary';

export default function BannerImage() {
  return (
    <div>
      <CldImage
        width="3000"
        height="657"
        // gravity="east"
        // src="<Public ID>"
        // fillBackground
        // className="h-screen w-screen"
        className="absolute top-0 -z-20 aspect-auto h-full w-full object-cover md:fixed  lg:top-0 xl:top-4 2xl:top-9"
        src="Banner-image-cropped_fiuipi"
        // crop="thumb"
        // removeBackground
        // tint="70:blue:green:purple"
        // underlay="<Public ID>"
        // sizes="100vh, 100vw, "
        sizes="100vw"
        alt="Description of my image"
      />
    </div>
  );
}

{
  /* BannerImage */
}
{
  /* <Image
        src={BannerImage}
        alt="Benjamin Chavez"
        className="absolute top-0 -z-20 aspect-auto h-full w-full object-cover md:fixed  lg:top-0 xl:top-4 2xl:top-9"
        priority
        quality={100}
        placeholder="blur"
      /> */
}
{
  /* <div className="absolute top-0 -z-10 aspect-auto h-full w-full bg-gradient-to-b from-transparent to-black/70 md:fixed" /> */
}
{
  /* <CldImage
        width="600"
        height="600"
        className="absolute top-0 -z-20 aspect-auto h-full w-full object-cover md:fixed  lg:top-0 xl:top-4 2xl:top-9"
        src="dyy8g76av/13b4dedc1e330e0833ae6ff959d76255"
        alt={''}
      /> */
}
