// src/components/skills.tsx

import { Container } from './container';

const technologies = [{ title: '', icon: '' }];

export default function Skills() {
  return (
    <section className="bg-parallax">
      <Container>
        <div className="flex items-center justify-center">
          <h2 className="font-dosis text-3xl uppercase leading-9 tracking-[.4rem] text-white">
            Skills
          </h2>
        </div>
      </Container>
    </section>
  );
}
