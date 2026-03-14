import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeInUp } from '../lib/motion';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover filter grayscale opacity-45"
        autoPlay
        muted
        loop
        playsInline
        poster="/assets/images/240511-Birk-1057.JPEG"
      >
        <source src="/assets/videos/reel_2.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/20" />
      <div className="absolute inset-0 bg-black/35" />
      <div className="container relative z-10 grid gap-16 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center pt-32 pb-20 md:pt-40 md:pb-32">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.18 }
            }
          }}
        >
          <motion.p className="eyebrow text-white/60" variants={fadeInUp}>
            Executive Health &amp; Performance
          </motion.p>
          <motion.h1 className="h1 max-w-2xl mt-8 text-white leading-[1.08]" variants={fadeInUp}>
            Private coaching for executives who need energy, clarity, and a body that performs.
          </motion.h1>
          <motion.p className="p max-w-md mt-7 text-white/65 leading-relaxed" variants={fadeInUp}>
            Personalized training, nutrition, and accountability built around the demands of executive life.
          </motion.p>
          <motion.div className="mt-12 flex flex-wrap items-center gap-5" variants={fadeInUp}>
            <Link href="/apply" className="btn-primary">Request Private Coaching</Link>
            <Link href="/coaching" className="btn-secondary text-sm">View Pricing</Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="hidden md:block"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="card p-8 border-white/[0.12] bg-white/[0.04]">
            <p className="eyebrow text-white/40 mb-6">project. ethos</p>
            <p className="text-white text-2xl font-semibold leading-snug tracking-[-0.01em]">
              Health is a disciplined pursuit,<br />practiced daily with intention.
            </p>
            <div className="mt-8 pt-8 border-t border-white/[0.08] grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-white font-semibold text-lg">1:1</div>
                <div className="eyebrow text-white/40 mt-1">Coaching</div>
              </div>
              <div>
                <div className="text-white font-semibold text-lg">Weekly</div>
                <div className="eyebrow text-white/40 mt-1">Check-ins</div>
              </div>
              <div>
                <div className="text-white font-semibold text-lg">24/7</div>
                <div className="eyebrow text-white/40 mt-1">Support</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
