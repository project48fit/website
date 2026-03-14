import Link from 'next/link';
import NewsletterForm from './NewsletterForm';

const NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Pricing', href: '/coaching' },
  { label: 'Resources', href: '/resources' },
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
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/projectfitness/',
    handle: 'projectfitness',
    icon: '/assets/icons/linkedin.svg'
  }
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-black/50 backdrop-blur">
      {/* Main footer grid */}
      <div className="container px-6 md:px-8 py-14 flex flex-col gap-14 lg:flex-row lg:items-start lg:justify-between">

        {/* Newsletter — replaces logo */}
        <div className="lg:max-w-xs">
          <p className="eyebrow text-white/50 mb-3">The project. Newsletter</p>
          <h3 className="text-white text-lg font-semibold tracking-[-0.01em]">Stay sharp.</h3>
          <p className="text-sm text-white/50 mt-2 leading-relaxed">
            Weekly training, nutrition, and performance insights for executives.
          </p>
          <NewsletterForm />
        </div>

        {/* Nav + Social */}
        <div className="grid w-full gap-10 sm:grid-cols-2 lg:w-auto">
          <div>
            <p className="eyebrow text-white/50">Navigation</p>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
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
            <p className="eyebrow text-white/50">Social</p>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 hover:text-white transition"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.07] text-white group-hover:bg-white/15 transition-colors">
                      <img src={social.icon} alt={social.label} width={18} height={18} />
                    </span>
                    <span>{social.handle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.05] py-6">
        <div className="container px-6 md:px-8 flex flex-col gap-3 text-xs uppercase tracking-[0.25em] text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} project. All rights reserved.</span>
          <div className="flex flex-wrap gap-4 text-[0.65rem]">
            <Link href="/privacy" className="hover:text-white/60 transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white/60 transition">Terms of Service</Link>
            <span>Built with intention</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
