export default function Resources() {
  return (
    <section className="section">
      <div className="section-header flex-col lg:flex-row">
        <div>
          <p className="eyebrow">Resources</p>
          <h2 className="h2 text-white mt-4">Level up between sessions.</h2>
        </div>
        <p className="p lg:max-w-md mt-6 lg:mt-0">
          Long-form articles, training templates, and challenges to keep you plugged into the process.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="card border border-white/12 bg-brand-surface/60 p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-white text-xl font-semibold">The project. Newsletter</h3>
            <p className="text-sm text-brand-muted mt-4">
              Weekly breakdowns on training variables, recovery tactics, and mindset.
            </p>
          </div>
          <button className="btn-secondary mt-8 self-start">Join List</button>
        </div>
        <div className="card border border-white/12 bg-brand-surface/60 p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-white text-xl font-semibold">Free 7-Day Kickstart Challenge</h3>
            <p className="text-sm text-brand-muted mt-4">
              Your launchpad to reset your body and mindset.
            </p>
          </div>
          <a
            className="btn-secondary mt-8 self-start"
            href="/assets/resources/7-day-kickstart.pdf"
            download
          >
            Download PDF
          </a>
        </div>
      </div>
    </section>
  );
}
