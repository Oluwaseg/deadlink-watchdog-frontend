import { ArrowRight, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "../Reveal";
import { HealthScore } from "../HealthScore";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-14 pb-24 sm:pt-20 sm:pb-32">
      {/* Background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid mask-fade-b opacity-[0.55]" />
        <div className="absolute left-1/2 top-[-14%] h-[560px] w-[960px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl opacity-50" />
        <div className="absolute right-[-8%] top-[10%] h-[280px] w-[380px] rounded-full bg-secondary/25 blur-3xl opacity-60" />
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        <div className="min-w-0">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft/70 px-3 py-1 text-xs font-medium text-accent-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
              For Nigerian websites that can't afford to look broken
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-5xl lg:text-6xl">
              A dead link is the fastest way to lose a visitor's trust.
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              DeadLink Watchdog crawls your site around the clock, catches broken links before your
              users do, and tells you exactly what to fix, before it costs you a customer, a
              reader, or a citizen who needed that government form.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="group h-12 rounded-full px-6 text-[15px] shadow-elegant hover:shadow-glow">
                <a href="#cta">
                  Start Monitoring Free
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 rounded-full border-border bg-surface px-6 text-[15px]">
                <a href="#how-it-works">
                  See How It Works
                  <ArrowDown className="ml-1 h-4 w-4" />
                </a>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <p className="mt-6 text-sm text-muted-foreground">
              No card required · Set up in under 2 minutes · Built and hosted with Nigerian uptime in mind
            </p>
          </Reveal>

          <Reveal delay={400}>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-6">
              {[
                { k: "24/7", v: "Continuous crawling" },
                { k: "< 2 min", v: "Time to first scan" },
                { k: "100%", v: "Free in early access" },
              ].map((s) => (
                <div key={s.k}>
                  <dt className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    {s.k}
                  </dt>
                  <dd className="mt-1 text-xs leading-snug text-muted-foreground">{s.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={200} className="lg:pl-6">
          <HealthScore target={98} />
        </Reveal>
      </div>
    </section>
  );
}
