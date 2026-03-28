// src/components/root-layout.tsx
import 'server-only';

import Footer from '@/components/footer';
import Navbar from './navbar';
import React from 'react';

function RootLayoutInner({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      <main className="w-full flex-auto">{children}</main>
      <Footer />
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootLayoutInner>{children}</RootLayoutInner>;
}
