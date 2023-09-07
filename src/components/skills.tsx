// src/components/skills.tsx

import { Container } from './container';
import TypescriptIcon from './icons/typescript-icon';

const technologies = [
  { title: 'TypeScript', icon: '' },
  { title: 'JavaScript', icon: '' },
  { title: 'Ruby', icon: '' },
  { title: 'Java', icon: '' },
  { title: 'Python', icon: '' },
  { title: 'SQL', icon: '' },
  // { title: 'PSQL', icon: '' },
  { title: 'HTML', icon: '' },
  { title: 'CSS', icon: '' },

  { title: 'React', icon: '' },
  { title: 'Ruby on Rails', icon: '' },
  { title: 'Next.js', icon: '' },
  { title: 'Node.js', icon: '' },
  { title: 'Git', icon: '' },
  { title: 'PostgreSQL', icon: '' },

  { title: 'Bootstrap', icon: '' },
  { title: 'Tailwind', icon: '' },

  { title: 'Figma', icon: '' },

  { title: 'Linux', icon: '' },
  { title: 'Windows', icon: '' },
  { title: 'Mac OSC', icon: '' },
];

export default function Skills() {
  return (
    <section className="bg-parallax mt-12 bg-fixed pt-4">
      <Container className="mt-12 pb-20 pt-4">
        <div className="flex  items-center justify-center">
          <h2 className="font-dosis text-3xl uppercase leading-9 tracking-[.4rem] text-white">
            Skills
          </h2>
        </div>
        <div className="font-open-sans mt-4 flex flex-wrap items-center justify-center gap-6">
          {' '}
          {technologies.map((tech) => (
            <div
              key={tech.title}
              className="flex items-center text-base text-white"
              justify-center
            >
              <TypescriptIcon /> {tech.title}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
