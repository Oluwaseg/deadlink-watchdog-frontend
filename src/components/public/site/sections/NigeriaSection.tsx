import { Reveal } from "../Reveal";

const sites = [
  { name: "gov.ng portal", score: 96, tone: "ok" as const },
  { name: "national news outlet", score: 88, tone: "ok" as const },
  { name: "fintech landing", score: 99, tone: "hero" as const },
  { name: "university site", score: 74, tone: "warn" as const },
];

export function NigeriaSection() {
  return (
    <section className="relative px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="relative grid grid-cols-1 items-center gap-12 overflow-hidden rounded-[2.5rem] bg-primary p-8 text-primary-foreground shadow-elegant md:p-16 lg:grid-cols-2 lg:gap-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-secondary"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-secondary/25 blur-3xl"
          />

          <Reveal variant="slide-right" className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1">
              <span className="h-2 w-3 rounded-sm bg-success" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">
                Why Nigeria
              </span>
            </div>
            <h2 className="text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-5xl md:text-6xl">
              Built here, <span className="text-secondary">for here.</span>
            </h2>
            <div className="max-w-md space-y-5 text-pretty text-lg leading-relaxed text-primary-foreground/75">
              <p>
                Most link-monitoring tools are built assuming perfect connectivity and
                international hosting norms. We didn't. DeadLink Watchdog is tuned for the
                reality of monitoring Nigerian websites, government portals, news outlets, and
                growing businesses that can't afford a silent broken form or a dead payment
                link.
              </p>
              <p>If your users are here, your monitoring should understand here too.</p>
            </div>
          </Reveal>

          <Reveal variant="scale-in" delay={120} className="relative">
            <div className="relative rotate-2 rounded-2xl bg-surface p-6 text-foreground shadow-2xl transition-transform duration-500 hover:rotate-0">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <span className="font-semibold text-primary">Ecosystem Health Score</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Live index
                </span>
              </div>
              <ul className="mt-4 space-y-3">
                {sites.map((s) => {
                  const hero = s.tone === "hero";
                  const warn = s.tone === "warn";
                  return (
                    <li
                      key={s.name}
                      className={
                        "flex items-center justify-between rounded-lg p-3 " +
                        (hero
                          ? "border border-primary/10 bg-primary-soft/60"
                          : "bg-surface-muted")
                      }
                    >
                      <span
                        className={
                          "text-sm font-medium " +
                          (hero ? "text-primary" : "text-foreground")
                        }
                      >
                        {s.name}
                      </span>
                      <span
                        className={
                          "rounded px-2 py-1 text-xs font-bold tabular-nums " +
                          (hero
                            ? "bg-secondary text-secondary-foreground"
                            : warn
                              ? "bg-secondary-soft text-secondary-foreground"
                              : "bg-primary-soft text-accent-foreground")
                        }
                      >
                        {s.score}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-secondary/30 blur-2xl"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
