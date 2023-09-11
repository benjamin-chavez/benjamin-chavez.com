// src/components/my-story.tsx
import 'server-only';
import { Container } from './container';

const storySection = {
  paragraphs: [
    {
      body: 'I originally went to college to study jazz guitar. With the support of my family, I had spent the majority of my life up to that point focused on studying and performing music. I loved the intricate details of musical composition and I could not wait to continue my studies in a college setting. However, a few semesters into my studies my interests began to expand and I started seriously considering changing my major.',
    },
    {
      body: 'Growing up my mom always told me “You know... everything is a business, right? You should learn business”. It was with these words imprinted in the back of my mind that I decided to take a few business courses, which eventually led me to change the course of my college studies from music to business. I subsequently graduated from DePaul University in Chicago with a double major in Finance and Economics and a double minor in International Business and Spanish.',
    },
    {
      body: "I spent five years working in the financial services industry, where I loved the complex work and the demanding work environments, typically full of type A individuals. However, it wasn't long after starting in the industry that I noticed two things: first, our ability to translate human logic into computer code was quickly destroying and creating jobs; and second, many businesses use extremely antiquated software.",
    },
    {
      body: 'It was with this knowledge that I realized that learning to code would inevitably be my next endeavor. After working as a senior financial analyst at Ayco, Goldman Sachs for three years, and soaking in as much knowledge as I could, I decided to take a leap. In January of 2020, I moved to Berlin, Germany to complete a 9-week full stack coding bootcamp at ',
      link: {
        href: 'https://www.lewagon.com/',
        text: 'Le Wagon',
      },
      bodyAfterLink:
        '. It was during this bootcamp that I discovered that not only do I have a passion for the complexity of backend development, but that I really enjoy the creativity that comes with frontend development as well.',
    },
    {
      body: `Currently, I am looking for work in financial services, and once again, my mother's words are in my head: “Everything is a business”. Keeping this in mind, I am looking for a company with interesting problems where my skills in computer science can be used synergistically to benefit the business.`,
    },
    {
      body: 'When I am not coding, you might find me producing/performing electronic music under the artist alias ',
      link: {
        href: 'https://aminchavez.com/',
        text: 'Amin Chavez',
      },
      bodyAfterLink: `, or reading. Here are a few books that changed me for the better:`,
    },
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

function TextLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      target="_blank"
      href={href}
      className="font-light text-neutral-900 underline hover:text-[#008000]"
    >
      {children}
    </a>
  );
}

export default function MyStory() {
  return (
    <section className="scroll-m-7 bg-[#ECEDFA] py-7" id="my-story">
      <Container className="max-w-5xl py-9">
        <div className="flex w-full flex-col items-center justify-center">
          <h2
            // mt-4
            className=" font-dosis text-3xl uppercase leading-9 tracking-[.4rem] text-[#141414]"
          >
            My Story
          </h2>
          {/* <h3
            // text-gray-500
            className="pt-2 font-open-sans text-[0.94rem] font-light  text-[#777777]"
          >
            A selection of my work as a full stack Developer in The U.S. and
            Germany.
          </h3> */}
          <article className="prose my-6 max-w-7xl columns-1 gap-x-4  md:columns-3">
            {storySection.paragraphs.map((paragraph, index) => (
              <p
                className=" break-inside-avoid-column font-open-sans text-[15px] font-light text-neutral-500"
                key={index}
              >
                {' '}
                {paragraph.body}
                {paragraph.link && (
                  <TextLink href={paragraph.link.href}>
                    {paragraph.link.text}
                  </TextLink>
                )}
                {paragraph.bodyAfterLink && paragraph.bodyAfterLink}
              </p>
            ))}
            <ul role="list" className="list-disc pl-5 marker:text-neutral-500">
              {storySection.books.map((book) => (
                <li
                  className="prose my-1 -indent-2 font-open-sans text-[15px] font-light text-neutral-500"
                  key={book.title}
                >
                  <TextLink href={book.url}>{book.title}</TextLink> by{' '}
                  {book.author}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </Container>
    </section>
  );
}
