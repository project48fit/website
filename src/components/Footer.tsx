import Link from 'next/link';
import Image from 'next/image';

const NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Coaching', href: '/coaching' },
  { label: 'Resources', href: '/resources' },
  { label: 'Apply', href: '/apply' }
];

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com/projectfitness', handle: '@projectfitness' },
  { label: 'YouTube', href: 'https://youtube.com/@projectfitness', handle: '@projectfitness' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@projectfitness', handle: '@projectfitness' }
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/40 backdrop-blur">
      <div className="container py-12 flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-5 max-w-sm">
          <Link href="/" className="inline-flex items-center gap-3 text-white hover:opacity-90 transition">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-accent shadow-[0_8px_24px_-12px_rgba(242,237,224,0.9)]">
              <Image
                src="/assets/images/2_icon.png"
                alt="project."
                width={30}
                height={30}
                className="object-contain"
              />
            </span>
            <span className="text-base font-semibold uppercase tracking-[0.35em]">project.</span>
          </Link>
          <p className="text-sm text-brand-muted leading-relaxed">
            Health as culture. Precision coaching, consistent accountability, and a community leaning forward.
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2">
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
                  <a href={social.href} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                    {social.handle}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 py-6">
        <div className="container flex flex-col gap-2 text-xs uppercase tracking-[0.25em] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} project. All rights reserved.</span>
          <span>Built with intention · Trained with precision</span>
        </div>
      </div>
    </footer>
  );
}
