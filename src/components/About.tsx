import Image from 'next/image';
import { motion } from 'framer-motion';
import { fadeInUp, fadeInScale } from '../lib/motion';

const APPROACH_CARDS = [
  {
    title: 'Training Architecture',
    description:
      'Fully custom programming built around your schedule, travel, and performance goals — periodized, adjusted weekly, and designed to compound over time.'
  },
  {
    title: 'Performance Nutrition',
    description:
      'Macro targets and meal structure that fuel your output, support recovery, and integrate into the demands of an executive schedule.'
  },
  {
    title: 'Accountability Systems',
    description:
      'Weekly check-ins, data-backed adjustments, and direct coach access that keep you progressing regardless of how demanding your week gets.'
  }
];

const TEAM_MEMBERS = [
  {
    name: 'Birk',
    img: '/assets/images/team_birk.JPEG',
    bio: 'Birk Hanson leads client experience and operations at project. He is your primary point of contact — from onboarding through every stage of your coaching engagement.'
  },
  {
    name: 'Caleb',
    img: '/assets/images/team_caleb.JPEG',
    bio: 'Caleb Thompson is a certified trainer and nutritionist who builds and manages every client program. Expect weekly check-ins, precise adjustments, and a plan that evolves with your performance.'
  }
];

export default function About() {
  return (
    <motion.section
      className="section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, staggerChildren: 0.2 } }
      }}
    >
      <div className="section-header flex-col md:flex-row">
        <div>
          <p className="eyebrow">Our Approach</p>
          <h2 className="h2 text-white mt-4">
            Precision programming for sustainable performance.
          </h2>
        </div>
        <p className="p md:max-w-md mt-6 md:mt-0">
          Every plan is built from the ground up: detailed intake, phase-based training,
          nutrition calibrated to your lifestyle, and dedicated coaches behind your weekly adjustments.
        </p>
      </div>
      <motion.div
        className="mt-12 grid gap-6 md:grid-cols-3"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.15 } }
        }}
      >
        {APPROACH_CARDS.map((item) => (
          <motion.div key={item.title} className="card border border-white/15 bg-white/5 p-8" variants={fadeInUp}>
            <span className="eyebrow text-brand-accent">{item.title}</span>
            <p className="text-white text-lg font-medium mt-6">{item.description}</p>
          </motion.div>
        ))}
      </motion.div>
      <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] items-center">
        <div className="grid gap-6 md:grid-cols-2">
          {TEAM_MEMBERS.map((athlete) => (
            <motion.div
              key={athlete.name}
              className="flip-card h-80 tilt-card"
              variants={fadeInScale}
              whileHover={{ rotateX: -3, rotateY: 3, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 120, damping: 15 }}
            >
              <div className="flip-card-inner">
                <div className="flip-card-front border border-white/10">
                  <div className="relative h-full w-full">
                    <Image
                      src={athlete.img}
                      alt={`${athlete.name} training`}
                      width={960}
                      height={1280}
                      className="absolute inset-0 h-full w-full object-cover"
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 45vw, 90vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <span className="eyebrow text-white/70">{athlete.name}</span>
                    </div>
                  </div>
                </div>
                <div className="flip-card-back border border-white/10 bg-brand-surface/90 p-6 flex flex-col justify-center gap-4">
                  <span className="eyebrow text-brand-accent">{athlete.name}</span>
                  <p className="text-white text-base leading-relaxed">{athlete.bio}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="rounded-3xl border border-white/15 bg-black/40 p-10 shadow-[0_25px_70px_-35px_rgba(0,0,0,0.9)]">
          <p className="eyebrow text-brand-accent">Who We Are</p>
          <h3 className="text-white text-3xl font-semibold tracking-tight mt-4">
            Coaches who live the lifestyle—and guide you through yours.
          </h3>
          <p className="text-base md:text-lg leading-relaxed text-brand-muted mt-6">
            project. is a performance coaching operation led by Birk and Caleb. We build structured, data-backed programs for executives who want to treat their health as seriously as their business.
          </p>
          <p className="text-base md:text-lg leading-relaxed text-brand-muted mt-4">
            Expect precise programming, weekly feedback, and a system that adapts to your schedule — not the other way around.
            We coach with intention, attention to detail, and the same standard of follow-through we expect from our clients.
          </p>
          <div className="mt-8 text-white/70 text-sm uppercase tracking-[0.35em]">
            Programming · Nutrition · Performance
          </div>
        </div>
      </div>
    </motion.section>
  );
}
