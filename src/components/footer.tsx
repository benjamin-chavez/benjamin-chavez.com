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
    <div className="bg-parallax bg-scroll py-20 " id="contact">
      <Container as="footer">
        {/* <div className="flex items-center justify-center bg-red-500 px-10"> */}
        <h2 className="font-dosis w-full  text-center text-3xl uppercase leading-9 tracking-[.4rem] text-white">
          Contact
        </h2>
        {/* </div> */}
        <div gap-7 className="mt-6 flex items-center justify-center  ">
          {contactLinks.map((contact) => {
            const { IconComponent } = contact;

            return (
              <a
                key={contact.title}
                className="text-gray-300"
                href={contact.url}
                target="_blank"
              >
                <IconComponent
                  // h-7 -mt-14
                  className=" h-[30px] w-full px-4 text-neutral-500 hover:text-white"
                />
              </a>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
