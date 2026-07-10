import { Quote, Star } from "lucide-react";
import { Reveal } from "../Reveal";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
  accent: "primary" | "secondary";
};

const testimonials: Testimonial[] = [
  {
    quote:
      "DeadLink Watchdog caught a broken checkout redirect on our pricing page before a single customer complained. It paid for itself in the first week.",
    name: "Amaka O.",
    role: "Founder, Lagos Commerce Co.",
    initials: "AO",
    accent: "primary",
  },
  {
    quote:
      "I stopped babysitting our marketing site. The health score is the first thing I check every morning, and the alerts actually make sense.",
    name: "Daniel K.",
    role: "Head of Growth, Fintech Startup",
    initials: "DK",
    accent: "secondary",
  },
  {
    quote:
      "We migrated a 400-page blog and DeadLink Watchdog surfaced every stale redirect in under two minutes. No spreadsheets, no crawling scripts.",
    name: "Priya S.",
    role: "SEO Lead, Content Agency",
    initials: "PS",
    accent: "primary",
  },
];

export function SocialProofSection() {
  return (
    <section className="relative border-y border-border bg-surface-muted/40 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
              Loved by operators
            </span>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">
              Trusted by teams who can't afford downtime to go unnoticed
            </h2>
            <p className="mt-3 text-pretty text-base text-muted-foreground">
              Real feedback from founders, marketers, and SEO leads who ship faster with DeadLink Watchdog.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={120 + i * 100}>
              <figure className="group relative flex h-full flex-col rounded-3xl border border-border bg-surface p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <Quote
                    className={`h-8 w-8 ${t.accent === "primary" ? "text-primary" : "text-secondary"}`}
                    aria-hidden
                  />
                  <div className="flex gap-0.5" aria-label="5 star rating">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} className="h-4 w-4 fill-secondary text-secondary" />
                    ))}
                  </div>
                </div>

                <blockquote className="mt-5 flex-1 text-pretty text-base leading-relaxed text-foreground/90">
                  "{t.quote}"
                </blockquote>

                <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold ${
                      t.accent === "primary"
                        ? "bg-primary/10 text-primary"
                        : "bg-secondary/15 text-secondary-foreground"
                    }`}
                    aria-hidden
                  >
                    {t.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-foreground">{t.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal delay={480}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <span>Indie founders</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>SEO agencies</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>E-commerce teams</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>Content studios</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
