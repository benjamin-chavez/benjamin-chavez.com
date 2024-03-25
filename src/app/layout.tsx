import 'server-only';

import RootLayout from '@/components/root-layout';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Metadata } from 'next';
// @ts-ignore
import { Dosis, Inter, Open_Sans } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});
const dosis = Dosis({
  subsets: ['latin'],
  variable: '--font-dosis',
});
const open_sans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://benjamin-chavez.com'),
  title: {
    default: 'Benjamin Chavez | Full Stack Developer',
    template: '%s | Benjamin Chavez',
  },
  description:
    'Ben Chavez is a Full Stack Developer with expertise in Javascript, Typescript, Node, React, Ruby on Rails, and PostgreSQL. Explore his portfolio to see his innovative solutions and proven track record in software development..',
  openGraph: {
    title: 'Benjamin Chavez',
    description:
      'Explore the portfolio of Benjamin Chavez, a Chicago-based Full Stack Developer with a strong background in Javascript, Typescript, Node, React, Ruby on Rails, and PostgreSQL. Discover his work and contributions to software development.',
    url: 'https://benjamin-chavez.com',
    siteName: 'Benjamin Chavez',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: 'Benjamin Chavez',
    card: 'summary_large_image',
  },
  verification: {
    google: '_bz_Bvz0AtQbn_4pRfLd9r_hg5mBxeJUfB1D9a-k4wg',
    // yandex: '14d2e73487fa6c71',
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${open_sans.variable} ${dosis.variable} ${inter.variable} h-full scroll-smooth bg-[#ECEDFA] font-dosis text-base antialiased`}
    >
      <body className=" flex min-h-full flex-col">
        <RootLayout>{children}</RootLayout>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
