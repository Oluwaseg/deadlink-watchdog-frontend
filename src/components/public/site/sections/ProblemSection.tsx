import { AlertTriangle } from "lucide-react";
import { Reveal } from "../Reveal";

export function ProblemSection() {
  return (
    <section className="border-y border-border bg-surface-muted/50 py-24 sm:py-28">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            <AlertTriangle className="h-3.5 w-3.5 text-warning" />
            The Problem
          </span>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-6 text-balance text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl lg:text-[44px]">
            You don't find broken links. Your users do.
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <div className="mx-auto mt-8 max-w-2xl space-y-5 text-pretty text-lg leading-relaxed text-muted-foreground">
            <p>
              By the time someone tells you a link is dead, they've usually already left. Multiply
              that by every page on your site, every week, and you've got a slow leak nobody's
              watching, until traffic drops, a partner complains, or a journalist screenshots your
              404 page.
            </p>
            <p>
              Manually checking links doesn't scale past a handful of pages. And most Nigerian teams
              don't have a dedicated ops person whose whole job is clicking through every link on the
              site.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
