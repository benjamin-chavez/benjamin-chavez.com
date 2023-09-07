// src/components/my-story.tsx

import { Container } from './container';

const storySection = {
  paragraphs: [
    [
      'I originally went to college to study jazz guitar. With the support of my family, I had spent the majority of my life up to that point focused on studying and performing music. I loved the intricate details of musical composition and I could not wait to continue my studies in a college setting. However, a few semesters into my studies my interests began to expand and I started seriously considering changing my major.',
      'Growing up my mom always told me “You know... everything is a business, right? You should learn business”. It was with these words imprinted in the back of my mind that I decided to take a few business courses, which eventually led me to change the course of my college studies from music to business. I subsequently graduated from DePaul University in Chicago with a double major in Finance and Economics and a double minor in International Business and Spanish.',
      "I spent five years working in the financial services industry, where I loved the complex work and the demanding work environments, typically full of type A individuals. However, it wasn't long after starting in the industry that I noticed two things: first, our ability to translate human logic into computer code was quickly destroying and creating jobs; and second, many businesses use extremely antiquated software.",
      'It was with this knowledge that I realized that learning to code would inevitably be my next endeavor. After working as a senior financial analyst at Ayco, Goldman Sachs for three years, and soaking in as much knowledge as I could, I decided to take a leap. In January of 2020, I moved to Berlin, Germany to complete a 9-week full stack coding bootcamp at Le Wagon. It was during this bootcamp that I discovered that not only do I have a passion for the complexity of backend development, but that I really enjoy the creativity that comes with frontend development as well.',
      "Currently, I am looking for work in financial services, and once again, my mother's words are in my head: “Everything is a business”. Keeping this in mind, I am looking for a company with interesting problems where my skills in computer science can be used synergistically to benefit the business.",
      'When I am not coding, you might find me producing/performing electronic music under the artist alias Amin Chavez, or reading. Here are a few books that changed me for the better:',
    ],
  ],
  books: [
    {
      title: 'Principles',
      author: 'Ray Dalio',
      url: 'https://www.amazon.com/Principles-Life-Work-Ray-Dalio/dp/1501124021/ref=tmm_hrd_swatch_0?_encoding=UTF8&qid=1586730183&sr=8-1-spons',
    },
    {
      title: 'Small Is Beautiful',
      author: 'E. F. Schumacher',
      url: 'https://www.amazon.com/Small-Beautiful-Economics-Mattered-Perennial/dp/0061997765/ref=sr_1_1?crid=2O1UHT92XOMKR&dchild=1&keywords=small+is+beautiful&qid=1586730233&sprefix=small+is+bea%2Caps%2C202&sr=8-1',
    },
    {
      title: 'How to Change Your Mind',
      author: 'Michael Pollan',
      url: 'https://www.amazon.com/Change-Your-Mind-Consciousness-Transcendence/dp/1594204225/ref=tmm_hrd_swatch_0?_encoding=UTF8&qid=1586742671&sr=8-1',
    },
    {
      title: "Liar's Poker",
      author: 'Michael Lewis',
      url: 'https://www.amazon.com/Liars-Poker-Rising-Through-Wreckage/dp/0393027503/ref=tmm_hrd_swatch_0?_encoding=UTF8&qid=1586730362&sr=8-2',
    },
  ],
};

export default function MyStory() {
  return (
    <section id="my-story">
      <Container>
        <div className="flex items-center justify-center">
          <h2 className="font-dosis text-3xl uppercase leading-9 tracking-[.4rem] text-[#141414]">
            My Story
          </h2>
        </div>
      </Container>
    </section>
  );
}
