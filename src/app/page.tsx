import Hero from '@/components/hero';
import MyStory from '@/components/my-story';
import Portfolio from '@/components/portfolio';
import Skills from '@/components/skills';

export const metadata = {
  description: '',
};

export default function Home() {
  return (
    <>
      <Hero />
      <Portfolio />
      {/* <div className="flex w-full items-center justify-center bg-blue-500">
        <div className="flex w-1/2 items-center justify-center bg-red-500/20">
          <p>Benjamin Chavez.com</p>
        </div>
      </div> */}
      <Skills />
      <MyStory />
    </>
  );
}
