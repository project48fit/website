import Image from 'next/image';

export default function About() {
  return (
    <section className="section">
      <div className="section-header flex-col md:flex-row">
        <div>
          <p className="eyebrow">Our Approach</p>
          <h2 className="h2 text-white mt-4">
            Precision programming for sustainable performance.
          </h2>
        </div>
        <p className="p md:max-w-md mt-6 md:mt-0">
          Every plan is built from the ground up: detailed intake, phase-based training,
          nutrition calibrated to your lifestyle, and real humans behind your weekly adjustments.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {[
          {
            title: 'Training Architecture',
            description:
              'We believe health is not a destination but a way of life. It’s the daily disciplines, the consistent choices, the quiet dedication that defines who we are.'
          },
          {
            title: 'Performance Nutrition',
            description:
              'Macro targets and meal structure that fuel your sessions, support recovery, and make sense in real life.'
          },
          {
            title: 'Accountability Systems',
            description:
              'Weekly check-ins, data-backed adjustments, and habits coaching so you stay moving forward.'
          }
        ].map((item) => (
          <div key={item.title} className="card border border-white/15 bg-white/5 p-8">
            <span className="eyebrow text-brand-accent">{item.title}</span>
            <p className="text-white text-lg font-medium mt-6">{item.description}</p>
          </div>
        ))}
      </div>
      <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] items-center">
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              name: 'Birk',
              img: '/assets/images/team_birk.JPEG',
              bio: 'Birk Hanson has been training clients since 2023. He will handle all business operations and be your point of contact for onboarding.'
            },
            {
              name: 'Caleb',
              img: '/assets/images/team_caleb.JPEG',
              bio: 'Caleb Thompson is a certified trainer & nutritionist. He has been training since 2022. Caleb will build out your exercise and meal plans. You can expect weekly check-ins with Caleb.'
            }
          ].map((athlete) => (
            <div
              key={athlete.name}
              className="flip-card h-80"
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
            </div>
          ))}
        </div>
        <div className="rounded-3xl border border-white/15 bg-black/40 p-10 shadow-[0_25px_70px_-35px_rgba(0,0,0,0.9)]">
          <p className="eyebrow text-brand-accent">Who We Are</p>
          <h3 className="text-white text-3xl font-semibold tracking-tight mt-4">
            Coaches who live the lifestyle—and guide you through yours.
          </h3>
          <p className="text-base md:text-lg leading-relaxed text-brand-muted mt-6">
            project. is a tight-knit coaching duo led by Birk and Caleb. We blend data-backed strength
            training with the honesty and accountability you need to keep showing up, rep after rep.
          </p>
          <p className="text-base md:text-lg leading-relaxed text-brand-muted mt-4">
            Expect thoughtful progression, weekly feedback, and a plan that flexes with your schedule.
            We coach the same way we train—with intention, attention to detail, and relentless follow-through.
          </p>
          <div className="mt-8 text-white/70 text-sm uppercase tracking-[0.35em]">
            Inside the project. · Training · Community · Cohesion
          </div>
        </div>
      </div>
    </section>
  );
}
