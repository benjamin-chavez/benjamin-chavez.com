import 'server-only';

import RootLayout from '@/components/root-layout';
import { Metadata } from 'next';
import { Dosis, Inter, Open_Sans } from 'next/font/google';
import '../styles/globals.css';
// import '../styles/mdx.css';
import '../styles/markdown-styles.css';

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
    default: 'Ben Chavez',
    template: '%s | Ben Chavez',
  },
  description: 'Full Stack Developer.',
  openGraph: {
    title: 'Benjamin Chavez',
    description: 'Full Stack Developer',
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
      </body>
    </html>
  );
}
