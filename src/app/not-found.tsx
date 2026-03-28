import { Container } from '@/components/container';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center justify-center py-32">
      <h1 className="font-dosis text-4xl uppercase tracking-[.4rem] text-[#141414]">
        404
      </h1>
      <p className="mt-4 font-open-sans text-[15px] text-gray-500">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="mt-8 font-dosis text-sm uppercase tracking-widest text-[#141414] underline underline-offset-4 hover:text-[#008000]"
      >
        Back to Home
      </Link>
    </Container>
  );
}
