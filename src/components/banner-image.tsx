// src/components/banner-image.tsx

export default function BannerImage() {
  return (
    <img
      src="https://res.cloudinary.com/dyy8g76av/image/upload/f_avif,q_auto,w_3000/Banner-image-cropped_fiuipi"
      alt="Benjamin Chavez Full Stack Developer"
      width={3000}
      height={657}
      className="absolute top-0 -z-20 aspect-auto h-full w-full object-cover md:fixed lg:top-0 xl:top-4 2xl:top-9"
    />
  );
}
