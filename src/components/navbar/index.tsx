// src/components/navbar/index.tsx

'use client';

import { cx } from 'cva.config';
import Link from 'next/link';
// @ts-ignore
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Container } from '../container';
import BarsIcon from '../icons/bars-icon';
import MobileMenu from './mobile-menu';

export type NavItem = {
  name: string;
};

const navItems: Record<string, NavItem> = {
  '/#home': {
    name: 'Home',
  },
  '/#portfolio': {
    name: 'Portfolio',
  },
  '/#my-story': {
    name: 'My Story',
  },
  '/#contact': {
    name: 'Contact',
  },
  '/blog': {
    name: 'Blog',
  },
};

export function LogoIconLink() {
  return (
    <Link
      href="/"
      className="whitespace-nowrap  text-xl font-normal uppercase leading-8 tracking-[0.2em] text-[#141414] !outline-none"
    >
      {/* <span className="sr-only">Ctrl-F Plus</span> */}
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

  const [activeSection, setActiveSection] = useState(pathname);

  const navItemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    if (pathname.includes('/blog')) {
      return;
    }

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const newActiveLink = navItemRefs.current[`/#${entry.target.id}`];
          if (newActiveLink) {
            setActiveSection(`/#${entry.target.id}`);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.9,
    });

    const sections = document.querySelectorAll('section[id]');

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [pathname]);

  const navLinks = useMemo(() => {
    return Object.entries(navItems).map(([path, { name }]) => {
      const isActive = path === activeSection;

      return (
        <Link
          key={path}
          href={path}
          ref={(el) => (navItemRefs.current[path] = el)}
          className={cx('mx-1 text-[#141414] transition-all ', {
            '!text-neutral-500 hover:!text-neutral-500/80': !isActive,
          })}
          onClick={() => {
            setActiveSection(path);
          }}
        >
          <span className="text-fs-lg">{name}</span>
        </Link>
      );
    });
  }, [activeSection]);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F8F9FA] py-1">
      <Container className="max-w-7xl md:max-w-none md:px-12">
        <nav
          //
          className="mx-auto flex h-full w-full items-center justify-between py-2"
          aria-label="Global"
        >
          <LogoIconLink />

          <div className="flex md:hidden">
            <button
              type="button"
              onClick={(e: React.MouseEvent) => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <BarsIcon />
            </button>
          </div>

          <div className="hidden md:block">
            <div className="text-fs-lg flex flex-row font-open-sans md:gap-x-3">
              {navLinks}
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
