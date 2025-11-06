import Link from 'next/link';
import Image from 'next/image';

const NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Coaching', href: '/coaching' },
  { label: 'Resources', href: '/resources' },
  { label: 'Apply', href: '/apply' }
];

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/project._________',
    handle: 'project._________',
    icon: '/assets/icons/instagram.svg'
  }
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur">
      <div className="container py-12 flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-center gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-accent shadow-[0_10px_30px_-18px_rgba(242,237,224,0.9)] overflow-hidden">
            <Image
              src="/assets/images/1.png"
              alt="project."
              width={56}
              height={56}
              className="object-cover"
            />
          </span>
          <span className="text-base font-semibold uppercase tracking-[0.35em] text-white">project.</span>
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
        <div className="container flex flex-col gap-2 text-xs uppercase tracking-[0.25em] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} project. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
