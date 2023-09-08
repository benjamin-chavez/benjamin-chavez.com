// src/components/root-layout.tsx
import 'server-only';

import Footer from '@/components/footer';
import Header from './header';
import Navbar from './navbar';

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
  // let pathname = usePathname();

  return (
    <RootLayoutInner>
      {/* <Header /> */}
      <Navbar />
      <main className="w-full flex-auto ">{children}</main>
      <Footer />
    </RootLayoutInner>
  );
}
