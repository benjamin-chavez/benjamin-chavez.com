// src/components/navbar/index.tsx
'use client';

import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Container } from '../container';
import Link from 'next/link';
import BarsIcon from '../icons/bars-icon';
import MobileMenu from './mobile-menu';

export type NavItem = {
  name: string;
};

const navItems: Record<string, NavItem> = {
  '/': {
    name: 'Home',
  },
  '/#portfolio': {
    name: 'Portfolio',
  },
  '/blog': {
    name: 'Blog',
  },
  '/#my-story': {
    name: 'My Story',
  },
  '/#contact': {
    // '/blog/building-a-chrome-extension-with-shared-state': {
    name: 'Contact',
  },
};

export function LogoIconLink() {
  return (
    <Link
      href="/"
      className="whitespace-nowrap text-xl font-normal uppercase leading-8 tracking-[0.2em] text-[#141414]"
    >
      <span className="sr-only">Ctrl-F Plus</span>
      {/* <LogoIcon /> */}
      Benjamin Chavez
    </Link>
  );
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  let pathname = usePathname() || '/';
  if (pathname.includes('/blog/')) {
    pathname = '/blog';
  }

  useEffect(() => {
    // const sections = document.querySelectorAll('section[id]');
    const sections = document.querySelectorAll('div[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentActive = document.querySelector('.active');
            if (currentActive) {
              currentActive.classList.remove('active');
            }

            const newActiveLink = document.querySelector(
              `[href="#${entry.target.id}"]`,
            );
            newActiveLink?.classList.add('active');
          }
        });
      },
      { threshold: 0.6 },
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <header
      // relative
      className="sticky top-0 z-50 w-full  bg-[#F8F9FA] py-1"
    >
      <Container
        // className="flex w-full items-center justify-between sm:px-4 md:px-4 lg:px-12"
        className="max-w-7xl"
      >
        <nav
          //
          className="mx-auto flex h-full w-full items-center justify-between p-2"
          aria-label="Global"
        >
          <LogoIconLink />

          <div className="flex md:hidden">
            <button type="button" onClick={() => setMobileMenuOpen(true)}>
              <span className="sr-only">Open main menu</span>
              <BarsIcon
              // className="h-full w-auto "
              />
            </button>
          </div>

          <div className="hidden md:block">
            <div className="text-fs-lg flex flex-row font-open-sans md:gap-x-3">
              {Object.entries(navItems).map(([path, { name }]) => {
                const isActive = path === pathname;

                return (
                  <Link
                    key={path}
                    href={path}
                    className={clsx('mx-1 text-[#141414] transition-all ', {
                      '!text-neutral-500 hover:!text-neutral-500/80': !isActive,
                    })}
                  >
                    <span className="text-fs-lg">{name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        <MobileMenu
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          navItems={navItems}
        />
      </Container>
    </header>
  );
}
