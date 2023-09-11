// src/components/footer.tsx

import { Container } from '@/components/container';
import { LinkedInIcon } from './icons/linkedin-icon';
import { GithubIcon } from './icons/github-icon';
import EnvelopeFilledIcon from './icons/envelope-filled-icon';

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
    <section className="scroll-m-7 bg-parallax bg-fixed py-7" id="contact">
      <Container as="footer" className="py-9">
        {/* <div className="py-5"> */}
        <h2 className="text-center font-dosis text-3xl uppercase leading-9 tracking-[.4rem] text-white">
          Contact
        </h2>
        <div
          // gap-7
          className="my-6 flex items-center justify-center  "
        >
          {contactLinks.map((contact) => {
            const { IconComponent } = contact;

            return (
              <a
                key={contact.title}
                className="text-gray-300"
                href={contact.url}
                target="_blank"
              >
                <IconComponent className=" h-[30px] w-full px-4 text-neutral-500 hover:text-white" />
              </a>
            );
          })}
          {/* </div> */}
        </div>
      </Container>
    </section>
  );
}
