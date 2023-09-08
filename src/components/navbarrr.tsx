// src/components/navbar.tsx

import Link from 'next/link';
import { useScroll } from 'framer-motion';

// text-green-500

export default function Navbarrr() {
  return (
    <div className="sticky top-0 z-50 w-full bg-red-500">
      <ul>
        <li className="font-semibold">
          <Link href="/#home">home</Link>
        </li>
        <li className="font-semibold">
          <Link href="/#test">test</Link>
        </li>
        <li className="font-semibold">
          <Link href="/#portfolio">portfolio</Link>
        </li>

        <li className="font-semibold">
          <Link href="/#my-story">my story</Link>
        </li>
        <li className="font-semibold">
          <Link href="/#contact">contact</Link>
        </li>
      </ul>
    </div>
  );
}
