import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-black/85 via-black/65 to-transparent backdrop-blur">
      <nav className="container flex h-20 items-center justify-between text-sm uppercase tracking-[0.25em] px-6 md:px-8">
        <Link href="/" className="hover:opacity-80 transition">
          <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-brand-accent/90 px-4 py-1.5 shadow-[0_8px_28px_-12px_rgba(242,237,224,0.7)]">
            <Image
              src="/assets/images/1.png"
              alt="project."
              width={120}
              height={38}
              priority
              className="h-7 w-auto object-contain"
            />
          </div>
        </Link>
        <div className="hidden lg:flex items-center gap-10 text-[0.65rem] text-white/80">
          <Link href="/about" className="hover:text-white transition">About</Link>
          <Link href="/coaching" className="hover:text-white transition">Pricing</Link>
          <Link href="/apply" className="btn-primary text-[0.6rem] hover:no-underline">Apply</Link>
        </div>
        <Link href="/apply" className="btn-primary lg:hidden text-[0.55rem]">
          Apply
        </Link>
      </nav>
    </header>
  );
}
