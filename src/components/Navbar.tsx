import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-black/85 via-black/65 to-transparent backdrop-blur">
      <nav className="container flex h-20 items-center justify-between text-sm uppercase tracking-[0.25em]">
        <Link href="/" className="flex items-center gap-3 text-white hover:opacity-90 transition">
          <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-accent shadow-[0_8px_24px_-12px_rgba(242,237,224,0.9)]">
            <Image
              src="/assets/images/2.png"
              alt="project. Coaching"
              width={28}
              height={28}
              className="object-contain"
            />
          </span>
          <span className="text-xs md:text-sm font-semibold tracking-[0.3em]">project.</span>
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
