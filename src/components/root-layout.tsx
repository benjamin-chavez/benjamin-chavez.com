// src/components/root-layout.tsx
import 'server-only';

import Footer from '@/components/footer';
import Header from './header';
import Navbar from './navbar';

function RootLayoutInner({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* <Header /> */}
      <Navbar />
      <main className="h-full w-full flex-auto ">{children}</main>
      <Footer />
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // let pathname = usePathname();

  return <RootLayoutInner>{children}</RootLayoutInner>;
}

// <motion.div
//   layout
//   style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40 }}
//   className="relative flex flex-auto overflow-hidden bg-red-500"
// >
//   <motion.div layout className="relative isolate flex w-full flex-col pt-9">
//     <GridPattern
//       className="absolute inset-x-0 -top-14 -z-10 h-[1000px] w-full fill-neutral-50 stroke-neutral-950/5 [mask-image:linear-gradient(to_bottom_left,white_40%,transparent_50%)]"
//       yOffset={-96}
//       interactive
//     />

//     <main className="w-full flex-auto">{children}</main>

//     <Footer />
//   </motion.div>
// </motion.div>;
