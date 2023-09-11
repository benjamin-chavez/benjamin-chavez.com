// src/components/footer.tsx
import { Container } from '@/components/container';
import 'server-only';
import EnvelopeFilledIcon from './icons/envelope-filled-icon';
import { GithubIcon } from './icons/github-icon';
import { LinkedInIcon } from './icons/linkedin-icon';

const contactLinks = [
  {
    title: 'LinkedIn',
    url: 'https://www.linkedin.com/in/benjaminchavez/',
    IconComponent: LinkedInIcon,
  },
  {
    title: 'GitHub',
    url: 'https://github.com/benjamin-chavez',
    IconComponent: GithubIcon,
  },
  {
    title: 'Email',
    url: 'mailto: ben.m.chavez@gmail.com',
    IconComponent: EnvelopeFilledIcon,
  },
];

export default function Footer() {
  return (
    <section className="bg-parallax py-7 md:bg-fixed" id="contact">
      <Container className="max-w-5xl py-9">
        <div className="flex flex-col items-center justify-center ">
          <h2 className=" font-dosis text-3xl uppercase leading-9 tracking-[.4rem] text-white">
            {/* Contact */}
            <span
              // tracking-[.4rem]
              className=""
            >
              Contac
            </span>
            t
          </h2>
        </div>
        <div className="my-6 flex items-center justify-center gap-8 font-open-sans ">
          {contactLinks.map((contact) => {
            const { IconComponent } = contact;
            return (
              <div
                key={contact.title}
                className="flex w-full flex-wrap items-center justify-center gap-5  "
              >
                <IconComponent className=" h-[30px] w-full text-neutral-500 hover:text-white" />
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

//  <div className="my-6 flex items-center justify-between  ">
//    {contactLinks.map((contact) => {
//      const { IconComponent } = contact;

//      return (
//        <a
//          key={contact.title}
//          className="text-gray-300"
//          href={contact.url}
//          target="_blank"
//        >
//          <IconComponent className=" h-[30px] w-full text-neutral-500 hover:text-white" />
//        </a>
//      );
//    })}
//  </div>;
