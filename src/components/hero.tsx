// src/components/hero.tsx

import Link from 'next/link';
import { Container } from './container';

export default function Hero() {
  return (
    <section
      // text-transparent
      className="bg-hero-image relative -z-10  -mt-14 min-h-screen w-full bg-cover bg-center bg-no-repeat"
    >
      <Container
        // as="section"
        // id="home-section"
        className="absolute bottom-0 "
      >
        <div className=" text-center">
          <h1>Benjamin Chavez</h1>
          <h2>Full Stack Developer</h2>
        </div>
        <div className="flex">
          <Link href="" className="">
            Portfolio
          </Link>
          <Link href="" className="">
            My Story
          </Link>
        </div>
      </Container>
    </section>
  );
}
