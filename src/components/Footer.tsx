import Link from 'next/link';
import Image from 'next/image';

const NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Pricing', href: '/coaching' },
  { label: 'Apply', href: '/apply' }
];

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/projectfitness.co',
    handle: 'projectfitness.co',
    icon: '/assets/icons/instagram.svg'
  },
  {
    label: 'Twitter',
    href: 'https://twitter.com/RealProject48',
    handle: 'RealProject48',
    icon: '/assets/icons/twitter.svg'
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@projectfitness.co',
    handle: 'projectfitness.co',
    icon: '/assets/icons/tiktok.svg'
  }
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur">
      <div className="container px-6 md:px-8 py-12 flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
        <div className="inline-flex items-center justify-center overflow-hidden rounded-[1.75rem] border border-white/10 bg-brand-accent/90 px-6 py-4 shadow-[0_24px_55px_-30px_rgba(242,237,224,0.9)] sm:px-10 sm:py-5">
          <Image
            src="/assets/images/1.png"
            alt="project."
            width={220}
            height={70}
            className="w-full max-w-[220px] object-contain"
          />
        </div>

        <div className="grid w-full gap-10 sm:grid-cols-2 lg:w-auto">
          <div>
            <p className="eyebrow text-white/70">Navigation</p>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-white/70">Social</p>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 hover:text-white transition"
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white group-hover:bg-white/20">
                      <Image src={social.icon} alt={social.label} width={18} height={18} />
                    </span>
                    <span>{social.handle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 py-6">
        <div className="container px-6 md:px-8 flex flex-col gap-3 text-xs uppercase tracking-[0.25em] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} project. All rights reserved.</span>
          <div className="flex flex-wrap gap-4 text-[0.65rem]">
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
            <span>Built with intention</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
