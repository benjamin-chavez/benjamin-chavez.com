// src/components/navbar/mobile-menu.tsx

'use client';

import { Dialog } from '@headlessui/react';
import Link from 'next/link';
import { LogoIconLink, NavItem } from '.';
import { XMarkIcon } from '../icons/x-mark-icon';
import { Container } from '../container';

export default function MobileMenu({
  navItems,
  mobileMenuOpen,
  setMobileMenuOpen,
}: {
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
        <div className="fixed inset-0 z-50" />

        <Dialog.Panel className="x-5 fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white py-3  pr-2 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <Container className="mx-auto max-w-7xl  md:max-w-none md:px-12">
            <div className="flex items-center justify-between ">
              <LogoIconLink  />

              <button type="button" onClick={() => setMobileMenuOpen(false)}>
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-8 w-auto" />
              </button>
            </div>

            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {Object.entries(navItems).map(([path, { name }]) => {
                    return (
                      <Link
                        key={path}
                        href={path}
                        className="-mx-3 block rounded-lg px-3 py-2 font-open-sans text-base font-normal leading-7 text-[#777777] hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </Container>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}
