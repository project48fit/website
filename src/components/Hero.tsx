import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeInUp, fadeInDelayed } from '../lib/motion';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
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
      <div className="container relative z-10 grid gap-12 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] items-end pt-32 pb-24">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.15 }
            }
          }}
        >
          <motion.p className="eyebrow text-white/70" variants={fadeInUp}>
            Individualized · Coaching · Accountability
          </motion.p>
          <motion.h1 className="h1 max-w-2xl mt-6 text-white leading-tight" variants={fadeInUp}>
            <span className="block">A vehicle for those who desire a healthier lifestyle.</span>
            <span className="block text-white">Start building today.</span>
          </motion.h1>
          <motion.p className="p max-w-lg mt-5 text-white/75" variants={fadeInUp}>
            Online coaching built on proven systems, relentless accountability, and truly individualized planning for busy professionals and competitive athletes.
          </motion.p>
          <motion.div className="mt-10 flex flex-wrap items-center gap-4" variants={fadeInUp}>
            <Link href="/apply" className="btn-primary">Start Coaching</Link>
          </motion.div>
        </motion.div>
        <motion.div
          className="hidden md:grid gap-4 text-sm"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, staggerChildren: 0.15 }
            }
          }}
        >
          <motion.div className="card p-6 border-white/20" variants={fadeInUp}>
            <span className="stat-label">project. Ethos</span>
            <p className="text-white text-2xl font-semibold mt-4 leading-snug">
              project. represents health as culture—<br />
              a disciplined pursuit, lived out daily.
            </p>
          </motion.div>
          <motion.div className="card p-6 border-white/10 grid grid-cols-3 gap-4 text-center" variants={fadeInUp}>
            <div>
              <div className="stat-value">1</div>
              <div className="stat-label">Personalized Program</div>
            </div>
            <div>
              <div className="stat-value">1</div>
              <div className="stat-label">Weekly Meeting</div>
            </div>
            <div>
              <div className="stat-value">24 / 7</div>
              <div className="stat-label">Access</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
