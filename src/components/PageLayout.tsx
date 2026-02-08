import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

type PageLayoutProps = {
  children: ReactNode;
  mainClassName?: string;
  withDefaultPadding?: boolean;
};

export default function PageLayout({
  children,
  mainClassName,
  withDefaultPadding = true
}: PageLayoutProps) {
  const basePadding = withDefaultPadding ? 'px-6 md:px-8' : '';
  const classes = [basePadding, mainClassName].filter(Boolean).join(' ');

  return (
    <>
      <Navbar />
      <main className={classes}>{children}</main>
      <Footer />
    </>
  );
}
