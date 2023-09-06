// src/components/header.tsx

import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex h-14 w-full items-center bg-[#F8F9FA] px-12 ">
      <div className="flex w-full justify-between">
        <div>
          <Link
            href=""
            className="text-xl font-normal uppercase leading-8 tracking-[0.2em] text-[#141414]"
          >
            Benjamin Chavez
          </Link>
        </div>
        <div
          // leading-8
          className="font-open-sans flex items-center text-base font-normal leading-6"
        >
          <Link href="" className="px-2">
            Home
          </Link>
          <Link href="" className="px-2">
            Portfolio
          </Link>
          <Link href="" className="px-2">
            My Story
          </Link>
          <Link href="" className="px-2">
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
}
