// src/components/root-layout.tsx
import 'server-only';

import Footer from '@/components/footer';
import Navbar from './navbar';

function RootLayoutInner({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className=" h-full w-full flex-auto">{children}</main>
      <Footer />
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootLayoutInner>{children}</RootLayoutInner>;
}
