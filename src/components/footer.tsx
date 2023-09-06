// src/components/footer.tsx

import { Container } from '@/components/container';

const contactLinks = [
  {
    title: 'LinkedIn',
    url: 'https://www.linkedin.com/in/benjaminchavez/',
    icon: '',
  },
  {
    title: 'GitHub',
    url: 'https://github.com/benjamin-chavez',
    icon: '',
  },
  {
    title: 'Email',
    url: 'mailto: ben.m.chavez@gmail.com',
    icon: '',
  },
];

export default function Footer() {
  return (
    <Container as="footer" className="bg-parallax bg-scroll py-5">
      <div className="flex items-center justify-center">
        <h2 className="font-dosis text-3xl uppercase leading-9 tracking-[.4rem] text-white">
          Contact
        </h2>
      </div>
      <div className="flex items-center justify-center gap-2 ">
        {contactLinks.map((contact) => (
          <a
            key={contact.title}
            className="text-gray-300"
            href={contact.url}
            target="_blank"
          >
            {contact.title}
          </a>
        ))}
      </div>
    </Container>
  );
}
