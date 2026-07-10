'use client';
import { CheckCircle2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

/** Animated health-score dial (SVG, no deps). */
export function HealthScore({ target = 98 }: { target?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<SVGSVGElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const dur = 1400;
          const tick = (t: number) => {
            const p = Math.min(1, (t - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            setValue(Math.round(eased * target));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  const size = 220;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;

  return (
    <div className='relative isolate mx-auto flex w-full max-w-md flex-col items-center'>
      <div className='absolute inset-0 -z-10 mask-radial-fade'>
        <div className='absolute inset-0 bg-dot opacity-60' />
      </div>
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className='drop-shadow-sm'
      >
        <defs>
          <linearGradient id='scoreGrad' x1='0' y1='0' x2='1' y2='1'>
            <stop offset='0%' stopColor='oklch(0.68 0.16 155)' />
            <stop offset='100%' stopColor='oklch(0.55 0.2 260)' />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill='none'
          stroke='var(--color-border)'
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill='none'
          stroke='url(#scoreGrad)'
          strokeWidth={stroke}
          strokeLinecap='round'
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 80ms linear' }}
        />
        <text
          x='50%'
          y='49%'
          textAnchor='middle'
          dominantBaseline='middle'
          className='fill-foreground'
          style={{ fontSize: 52, fontWeight: 700, letterSpacing: '-0.03em' }}
        >
          {value}
        </text>
        <text
          x='50%'
          y='65%'
          textAnchor='middle'
          className='fill-muted-foreground'
          style={{
            fontSize: 12,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Health Score
        </text>
      </svg>
      <div className='mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground'>
        <span className='relative flex h-2 w-2'>
          <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-70' />
          <span className='relative inline-flex h-2 w-2 rounded-full bg-success' />
        </span>
        Last crawl: 2 minutes ago
      </div>
      <div className='mt-6 w-full space-y-2 rounded-2xl border border-border bg-surface p-4 shadow-elegant'>
        {[
          { label: 'Pages crawled', value: '1,284' },
          { label: 'Links checked', value: '6,912' },
          { label: 'Broken', value: '3', accent: true },
        ].map((row) => (
          <div
            key={row.label}
            className='flex items-center justify-between text-sm'
          >
            <span className='text-muted-foreground'>{row.label}</span>
            <span
              className={
                row.accent
                  ? 'font-semibold text-destructive'
                  : 'font-semibold text-foreground'
              }
            >
              {row.value}
            </span>
          </div>
        ))}
        <div className='mt-2 flex items-center gap-2 rounded-lg bg-primary-soft/60 px-3 py-2 text-xs text-accent-foreground'>
          <CheckCircle2 className='h-3.5 w-3.5' />
          Alert sent to your inbox
        </div>
      </div>
    </div>
  );
}
