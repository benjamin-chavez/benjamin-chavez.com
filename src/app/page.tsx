import Hero from '@/components/hero';
import MyStory from '@/components/my-story';
import Portfolio from '@/components/portfolio';
import Skills from '@/components/skills';
import Test from '@/components/test';

export const metadata = {
  description: '',
};

export default function Home() {
  return (
    <>
      <Hero />
      {/* <Test /> */}
      <Portfolio />
      <Skills />
      <MyStory />
    </>
  );
}
