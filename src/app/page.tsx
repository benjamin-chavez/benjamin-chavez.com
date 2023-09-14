import 'server-only';

import Hero from '@/components/hero';
import MyStory from '@/components/my-story';
import Portfolio from '@/components/portfolio';
import Skills from '@/components/skills';

// export const metadata = {
//   description: '',
// };

export default function Home() {
  return (
    <>
      <Hero />
      <Portfolio />
      <Skills />
      <MyStory />
    </>
  );
}
