// src/components/footer.tsx
import 'server-only';
import { Container } from '@/components/container';
import { LinkedInIcon } from './icons/linkedin-icon';
import { GithubIcon } from './icons/github-icon';
import EnvelopeFilledIcon from './icons/envelope-filled-icon';

import BootstrapIcon from './icons/bootstrap-icon';
import CssIcon from './icons/css-icon';
import DatabaseIcon from './icons/database-icon';
import ExcelIcon from './icons/excel-icon';
import FigmaIcon from './icons/figma-icon';
import GitIcon from './icons/git-icon';
import HtmlIcon from './icons/html-icon';
import JavaIcon from './icons/java-icon';
import JavaScriptIcon from './icons/javascript-icon';
import LinuxIcon from './icons/linux-icon';
import MacIcon from './icons/mac-icon';
import NextjsIcon from './icons/nextjs-icon';
import NodeIcon from './icons/node-icon';
import PostgresIcon from './icons/postgres-icon';
import PythonIcon from './icons/python-icon';
import RailsIcon from './icons/rails-icon';
import ReactIcon from './icons/react-icon';
import ReduxIcon from './icons/redux-icon';
import RubyIcon from './icons/ruby-icon';
import TailwindIcon from './icons/tailwind-icon';
import TypescriptIcon from './icons/typescript-icon';
import WindowsIcon from './icons/windows-icon';

const technologies = {
  'Languages & Technologies': [
    { title: 'TypeScript', IconComponent: TypescriptIcon },
    { title: 'JavaScript', IconComponent: JavaScriptIcon },
    { title: 'Ruby', IconComponent: RubyIcon },
  ],
};

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
  // <span className="tracking-[.4rem]">Contac</span>t
  return (
    <section className="bg-parallax py-7 md:bg-fixed">
      <Container className="max-w-5xl py-9">
        <div className="flex flex-col items-center justify-center ">
          <h2 className=" font-dosis text-3xl uppercase leading-9 tracking-[.4rem] text-white">
            Technologies
          </h2>
        </div>
        <div className="my-6 flex flex-col items-center  justify-center gap-8 font-open-sans ">
          {Object.entries(technologies).map(([category, techs]) => {
            return (
              <div
                key={category}
                className="flex w-full flex-wrap items-center justify-center gap-5  "
              >
                {techs.map((tech) => {
                  const { IconComponent } = tech;

                  return (
                    <div
                      key={tech.title}
                      className="flex items-center whitespace-nowrap text-base text-white"
                    >
                      <IconComponent />
                      <span className="ml-1">{tech.title}</span>
                    </div>
                  );
                })}
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
