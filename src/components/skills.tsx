// src/components/skills.tsx

import { Container } from './container';
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
    { title: 'Java', IconComponent: JavaIcon },
    { title: 'Python', IconComponent: PythonIcon },
    { title: 'VBA', IconComponent: ExcelIcon },
    { title: 'HTML', IconComponent: HtmlIcon },
    { title: 'CSS', IconComponent: CssIcon },
  ],
  'Frameworks, Libraries & Databases': [
    { title: 'React', IconComponent: ReactIcon },
    { title: 'Redux', IconComponent: ReduxIcon },
    { title: 'Ruby on Rails', IconComponent: RailsIcon },
    { title: 'Next.js', IconComponent: NextjsIcon },
    { title: 'Node.js', IconComponent: NodeIcon },
    { title: 'SQL', IconComponent: DatabaseIcon },
    { title: 'PostgreSQL', IconComponent: PostgresIcon },
    { title: 'Bootstrap', IconComponent: BootstrapIcon },
    { title: 'Tailwind', IconComponent: TailwindIcon },
  ],
  'Tools & Platforms': [
    { title: 'Git', IconComponent: GitIcon },
    { title: 'Figma', IconComponent: FigmaIcon },
    { title: 'Linux', IconComponent: LinuxIcon },
    { title: 'Windows', IconComponent: WindowsIcon },
    { title: 'Mac OS', IconComponent: MacIcon },
  ],
};

export default function Skills() {
  return (
    <section className="bg-parallax bg-fixed py-12">
      <Container className="max-w-5xl">
        <div className="flex flex-col items-center justify-center ">
          <h2 className="mt-4 font-dosis text-3xl uppercase leading-9 tracking-[.4rem] text-white">
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
                      // className="flex whitespace-nowrap text-white"
                      justify-center
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
