// src/components/footer.tsx

import { Container } from '@/components/container';

export default function Footer() {
  return (
    <Container as="footer" className="">
      <div className="flex items-center justify-center">
        <h2>Contact</h2>
      </div>
      <div className="flex items-center justify-center gap-2">
        {' '}
        <div>LinkedIn</div>
        <div>Github</div>
        <div>Email</div>
      </div>
    </Container>
  );
}

