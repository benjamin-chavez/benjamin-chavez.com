// src/components/footer.tsx
import 'server-only';
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
    <section className="scroll-m-7 bg-parallax py-7 md:bg-fixed" id="contact">
      <Container
        as="footer"
        className=" py-9"
        // flex items-center justify-center
      >
        <div className="flex flex-col items-center justify-center">
          <div className="w-fit">
            <h2 className=" w-fit font-dosis text-3xl uppercase leading-9 text-white ">
              <span className="tracking-[.4rem]">Contac</span>t
            </h2>
            <div className="my-6 flex items-center justify-between  ">
              {contactLinks.map((contact) => {
                const { IconComponent } = contact;

                return (
                  <a
                    key={contact.title}
                    className="text-gray-300"
                    href={contact.url}
                    target="_blank"
                  >
                    <IconComponent className=" h-[30px] w-full text-neutral-500 hover:text-white" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
