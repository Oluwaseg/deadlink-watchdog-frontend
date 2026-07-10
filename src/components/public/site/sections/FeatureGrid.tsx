import { Reveal } from "../Reveal";

export function FeatureGrid() {
  return (
    <section className="border-y border-border bg-surface-muted/40 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-primary">Features</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-[-0.02em] text-foreground sm:text-4xl lg:text-5xl">
            The essentials, done properly.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Hero tile — Never miss a broken link */}
          <Reveal variant="scale-in" className="md:col-span-8">
            <div className="group relative h-full overflow-hidden rounded-3xl bg-primary p-10 text-primary-foreground shadow-elegant transition-transform hover:-translate-y-1">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-secondary/20 blur-3xl"
              />
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
                Uptime intelligence
              </p>
              <h3 className="max-w-md text-3xl font-semibold tracking-tight">
                Never miss a broken link
              </h3>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-primary-foreground/80">
                Every page, every link, checked on the schedule you choose, daily if you're a
                news site, monthly if you're a static brochure page.
              </p>
              <div className="mt-12 flex items-center gap-4">
                <div className="h-px flex-1 bg-primary-foreground/20" />
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary-foreground/20">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* One number */}
          <Reveal variant="fade-up" delay={80} className="md:col-span-4">
            <div className="h-full rounded-3xl border border-border bg-surface p-8 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-elegant">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                <span className="text-xl font-bold text-secondary-foreground">98</span>
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                One number that tells you everything
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                Your health score turns "is my site okay?" into a single glance instead of a
                guessing game.
              </p>
            </div>
          </Reveal>

          {/* See the trend */}
          <Reveal variant="fade-up" delay={140} className="md:col-span-4">
            <div className="h-full rounded-3xl border border-border bg-surface p-8 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-elegant">
              <div className="mb-6 flex items-end gap-1.5">
                <span className="h-4 w-2 rounded-sm bg-primary/25" />
                <span className="h-6 w-2 rounded-sm bg-primary/40" />
                <span className="h-5 w-2 rounded-sm bg-primary/30" />
                <span className="h-8 w-2 rounded-sm bg-primary/60" />
                <span className="h-10 w-2 rounded-sm bg-primary" />
                <span className="h-7 w-2 rounded-sm bg-secondary" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                See the trend, not just the snapshot
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                Track whether your site is getting healthier or quietly rotting, week over week.
              </p>
            </div>
          </Reveal>

          {/* Alerts wide tile */}
          <Reveal variant="fade-up" delay={200} className="md:col-span-8">
            <div className="flex h-full flex-col justify-between gap-6 rounded-3xl border-2 border-dashed border-primary/20 bg-primary-soft/30 p-8">
              <div className="max-w-md">
                <h3 className="text-xl font-semibold tracking-tight text-foreground">
                  Alerts that actually reach you
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                  Email or webhook, your choice, the moment something breaks, not buried in a
                  weekly digest you'll never open.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-lg border border-primary/15 bg-primary/5 px-4 py-2 text-sm font-semibold text-accent-foreground">
                  <span className="h-2 w-2 rounded-full bg-success" />
                  Live now
                </span>
                {["Email", "Webhook", "Slack", "Discord"].map((c) => (
                  <span
                    key={c}
                    className="rounded-lg border border-secondary/30 bg-secondary/15 px-4 py-2 text-sm font-semibold text-accent-foreground"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
