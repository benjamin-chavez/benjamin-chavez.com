// src/components/root-layout.tsx
'use client';

import { usePathname } from 'next/navigation';
// import { Arimo, Inter, Open_Sans, Dosis } from 'next/font/google';
import Footer from '@/components/footer';
import Header from './header';
import Hero from './hero';

// const inter = Inter({
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-inter',
// });
// const dosis = Dosis({
//   subsets: ['latin'],
//   variable: '--font-dosis',
// });
// const open_sans = Open_Sans({
//   subsets: ['latin'],
//   variable: '--font-open-sans',
// });

// const arimo = Arimo({
//   subsets: ['latin'],
//   variable: '--font-arimo',
// });

function RootLayoutInner({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div>{children}</div>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let pathname = usePathname();

  return (
    <RootLayoutInner>
      <Header />
      <Hero />
      <main className="w-full flex-auto ">{children}</main>
      <Footer />
    </RootLayoutInner>
  );
}
