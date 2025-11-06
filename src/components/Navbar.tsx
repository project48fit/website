import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-black/85 via-black/65 to-transparent backdrop-blur">
      <nav className="container flex h-20 items-center justify-between text-sm uppercase tracking-[0.25em]">
        <Link href="/" className="flex items-center gap-3 text-white hover:opacity-90 transition">
          <span className="relative inline-flex items-center justify-center">
            <Image
              src="/assets/images/1_logo.png"
              alt="project."
              width={120}
              height={32}
              priority
              className="h-8 w-auto object-contain drop-shadow-[0_6px_18px_rgba(0,0,0,0.45)]"
            />
          </span>
        </Link>
        <div className="hidden lg:flex items-center gap-10 text-[0.65rem] text-white/80">
          <Link href="/about" className="hover:text-white transition">About</Link>
          <Link href="/coaching" className="hover:text-white transition">Coaching</Link>
          <Link href="/resources" className="hover:text-white transition">Resources</Link>
          <Link href="/apply" className="btn-primary text-[0.6rem] hover:no-underline">Apply</Link>
        </div>
        <Link href="/apply" className="btn-primary lg:hidden text-[0.55rem]">
          Apply
        </Link>
      </nav>
    </header>
  );
}
