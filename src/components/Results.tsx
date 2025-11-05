import Image from 'next/image';

export default function Results() {
  return (
    <section className="section">
      <div className="section-header flex-col lg:flex-row">
        <div>
          <p className="eyebrow">Proof</p>
          <h2 className="h2 text-white mt-4">Performance wins from the project. roster.</h2>
        </div>
        <p className="p lg:max-w-md mt-6 lg:mt-0">
          From powerlifting totals to photoshoot prep, our athletes strip out the guesswork and execute with confidence.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {[
          {
            name: 'Birk — 18 Week Recomp',
            outcome: '+35 lb on squat · -9% body fat',
            image: '/assets/images/team_birk.JPEG'
          },
          {
            name: 'Caleb — Meet Prep',
            outcome: 'State podium finish · PR total 1425 lb',
            image: '/assets/images/team_caleb.JPEG'
          }
        ].map((item) => (
          <article key={item.name} className="relative h-80 overflow-hidden rounded-3xl border border-white/10">
            <div className="absolute inset-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <span className="eyebrow text-white/70">{item.name}</span>
              <p className="text-white text-2xl font-semibold mt-3">{item.outcome}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
