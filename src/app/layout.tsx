// src/app/layout.tsx
import 'server-only';

import RootLayout from '@/components/root-layout';
import { clientEnv } from '@/clientEnv';
import { Metadata, Viewport } from 'next';
import { Dosis, Inter, Open_Sans } from 'next/font/google';
import '../styles/globals.css';
import React from 'react';
import { CloudflareAnalytics } from '@/components/utility/cloudflare-analytics';

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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(clientEnv.NEXT_PUBLIC_APP_URL),
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
    url: clientEnv.NEXT_PUBLIC_APP_URL,
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
export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${open_sans.variable} ${dosis.variable} ${inter.variable} h-full scroll-smooth bg-[#ECEDFA] font-dosis text-base antialiased`}
    >
      <body className="flex min-h-full flex-col ">
        <div className="pointer-events-none fixed inset-0 -z-50 bg-[linear-gradient(to_bottom,#F8F9FA_0%,#F8F9FA_50%,#040804_50%,#040804_100%)]" />

        <RootLayout>{children}</RootLayout>
        {/*<CloudWatchRealUserMonitoring />*/}
        {/*<SentryInit />*/}
        <CloudflareAnalytics />
      </body>
    </html>
  );
}
