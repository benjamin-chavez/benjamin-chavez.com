// src/components/navbar/index.tsx
'use client';

import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { useRef, useState, useEffect, useMemo } from 'react';
import { Container } from '../container';
import Link from 'next/link';
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
    // '/blog/building-a-chrome-extension-with-shared-state': {
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

  const navItemRefs = useRef({});
  // const navItemRefs = useRef(
  //   Object.keys(navItems).reduce(
  //     (acc, path) => {
  //       acc[path] = null;
  //       return acc;
  //     },
  //     {} as Record<string, HTMLAnchorElement | null>,
  //   ),
  // );

  let pathname = usePathname() || '/';
  if (pathname.includes('/blog/')) {
    pathname = '/blog';
  }

  const setActiveLinkBasedOnSection = (sectionPath: string) => {
    // Remove the active state from all navItems
    Object.values(navItemRefs.current).forEach((el) => {
      if (el) el.classList.remove('active-heyaaa');
    });

    // Set the clicked navItem as active
    const newActiveLink = navItemRefs.current[sectionPath];
    if (newActiveLink) {
      newActiveLink.classList.add('active-heyaaa');
    }
  };

  const [activeSection, setActiveSection] = useState(pathname);
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    console.log('sections: ', sections);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          console.log('entry: ', entry.target.id);
          if (entry.isIntersecting) {
            const currentActive = document.querySelector('.active-heyaaa');
            if (currentActive) {
              currentActive.classList.remove('active-heyaaa');
            }

            console.log('navItemRefs: ', navItemRefs);

            const newActiveLink = navItemRefs.current[`/#${entry.target.id}`];
            console.log(newActiveLink, `[href="#${entry.target.id}"]`);
            if (newActiveLink) {
              newActiveLink.classList.add('active-heyaaa');
              // pathname = `/#${entry.target.id}`;
              setActiveSection(`/#${entry.target.id}`);
              console.log('pathname: ', pathname);
            }
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

    setActiveLinkBasedOnSection(pathname);
  }, [pathname]);

  setActiveLinkBasedOnSection(pathname);

  const navLinks = useMemo(() => {
    return Object.entries(navItems).map(([path, { name }]) => {
      // const isActive = path === pathname;
      const isActive = path === activeSection;

      return (
        <Link
          key={path}
          href={path}
          ref={(el) => (navItemRefs.current[path] = el)}
          className={clsx('mx-1 text-[#141414] transition-all ', {
            '!text-neutral-500 hover:!text-neutral-500/80': !isActive,
          })}
          onClick={() => {
            console.log(path);
            setActiveSection(path);
          }}
        >
          <span className="text-fs-lg">{name}</span>
        </Link>
      );
    });
  }, [activeSection]);

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

          <div
            // className="hidden md:block"
            className="block"
          >
            <div className="text-fs-lg flex flex-row font-open-sans md:gap-x-3">
              {/* {Object.entries(navItems).map(([path, { name }]) => {
                const isActive = path === pathname;

                return (
                  <Link
                    key={path}
                    href={path}
                    ref={(el) => (navItemRefs.current[path] = el)}
                    className={clsx('mx-1 text-[#141414] transition-all ', {
                      '!text-neutral-500 hover:!text-neutral-500/80': !isActive,
                    })}
                  >
                    <span className="text-fs-lg">{name}</span>
                  </Link>
                );
              })} */}
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
