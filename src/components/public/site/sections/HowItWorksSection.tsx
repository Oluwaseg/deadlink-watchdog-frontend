import { Reveal } from "../Reveal";

const steps = [
  {
    n: "01",
    title: "Add your site",
    body: "Drop in your URL and tell us how often to check it, daily, weekly, or monthly.",
  },
  {
    n: "02",
    title: "We crawl every corner",
    body: "DeadLink Watchdog quietly works through your entire site, page by page, link by link, no rendering issues, no missed pages.",
  },
  {
    n: "03",
    title: "Get a health score, instantly",
    body: "Every crawl comes back with a simple score out of 100. 95%? Solid. Dropping fast? You'll know before your visitors do.",
  },
  {
    n: "04",
    title: "Fix it before it matters",
    body: "Get an alert the moment something breaks, with the exact page and link that failed, not a vague warning, an actual fix list.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-primary">
            How it works
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-[-0.02em] text-foreground sm:text-4xl lg:text-5xl">
            Set it up once. Watch it work forever.
          </h2>
        </Reveal>

        <ol className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal
              key={s.n}
              as="li"
              variant="fade-up"
              delay={i * 90}
              className={i % 2 === 1 ? "md:mt-10" : ""}
            >
              <div className="group h-full rounded-2xl border border-border bg-surface p-8 shadow-elegant transition-colors hover:border-secondary">
                <span className="mb-4 block text-5xl font-bold leading-none tracking-tight text-primary/15 transition-colors group-hover:text-secondary/50">
                  {s.n}
                </span>
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
