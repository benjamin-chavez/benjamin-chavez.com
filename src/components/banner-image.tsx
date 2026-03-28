import ParallaxBackground from './parallax-background';

export default function BannerImage() {
  return (
    <ParallaxBackground
      src="https://res.cloudinary.com/dyy8g76av/image/upload/f_avif,q_auto,w_3000/Banner-image-cropped_fiuipi"
      className="-z-20"
      imageClassName="bg-center"
      speed={0.16}
      overscan={18}
    />
  );
}
