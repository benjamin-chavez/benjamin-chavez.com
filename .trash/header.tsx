// src/components/header.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cx } from '../../cva.config';
import BarsIcon from './icons/bars-icon';
import { XMarkIcon } from './icons/x-mark-icon';
import { Container } from './container';

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
  // '/blog': {
  //   name: 'Blog',
  // },
  '/#my-story': {
    name: 'My Story',
  },
  '/#contact': {
    name: 'Contact',
  },
};

type NavLinksProps = {
  pathname: string;
  onClick?: () => void;
  linkClassName?: string;
  activeLinkClassName?: string;
};

function NavigationLinks({
  pathname,
  onClick,
  linkClassName,
  activeLinkClassName,
}: NavLinksProps) {
  return (
    <>
      {Object.entries(navItems).map(([path, { name }]) => {
        const isActive = path === pathname;
        const combinedClassName = cx(
          linkClassName,
          isActive && activeLinkClassName,
        );

        return (
          <Link
            key={path}
            href={path}
            className={combinedClassName}
            onClick={onClick}
          >
            <span>{name}</span>
          </Link>
        );
      })}
    </>
  );
}

function DesktopNavigation({ pathname }: { pathname: string }) {
  return (
    <div className="hidden items-center md:flex">
      <NavigationLinks
        pathname={pathname}
        // linkClassName="font-open-sans p-2 text-base font-normal leading-6 text-[#1F1F1F]"
        // activeLinkClassName="!text-stone-400 hover:!text-stone-500"

        linkClassName="font-open-sans p-2 text-base font-normal leading-6 text-stone-400 hover:text-stone-500"
        activeLinkClassName="text-[#1F1F1F]"
      />
    </div>
  );
}

function MobileNavigation({
  pathname,
  mobileMenuOpen,
  setMobileMenuOpen,
}: {
  pathname: any;
  navItems: Record<string, NavItem>;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (value: boolean) => void;
}) {
  return (
    <>
      <Dialog
        as="nav"
        className="block md:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-50 " />
        <Dialog.Panel
          // px-12
          className="x-5 fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white py-3 pl-12 pr-8 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
        >
          <div className="flex items-center justify-between ">
            <Link
              href="/"
              className="flex items-center justify-center whitespace-nowrap text-xl font-normal uppercase leading-8 tracking-[0.2em] text-[#141414]"
            >
              Benjamin Chavez
            </Link>

            <button type="button" onClick={() => setMobileMenuOpen(false)}>
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-8 w-auto " />
            </button>
          </div>

          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <NavigationLinks
                  pathname={pathname}
                  linkClassName="text-red -mx-3 block rounded-lg px-3 py-2 text-base font-normal leading-7 hover:bg-gray-50 font-open-sans"
                  onClick={() => setMobileMenuOpen(false)}
                />
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  let pathname = usePathname() || '/';
  if (pathname.includes('/blog/')) {
    pathname = '/blog';
  }

  return (
    <header
      // px-12
      className="sticky top-0 z-50 flex h-14 w-full items-center justify-center bg-[#F8F9FA]  "
    >
      <div className="w-full px-[15px]">
        <div className="flex w-full justify-between ">
          <Link
            href="/"
            className="flex items-center justify-center whitespace-nowrap text-xl font-normal uppercase leading-8 tracking-[0.2em] text-[#141414]"
          >
            Benjamin Chavez
          </Link>

          <div className="flex md:hidden">
            <button type="button" onClick={() => setMobileMenuOpen(true)}>
              <span className="sr-only">Open main menu</span>
              <BarsIcon className="h-full w-auto " />
            </button>
          </div>

          <DesktopNavigation pathname={pathname} />
          <MobileNavigation
            pathname={pathname}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            navItems={navItems}
          />
        </div>
      </div>
    </header>
  );
}
