import { cn } from '@/lib/utils';
import {
  Accessibility,
  Contrast,
  MousePointer2,
  RotateCcw,
  Type,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

type Prefs = {
  fontScale: number; // 1, 1.15, 1.3
  highContrast: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: Prefs = {
  fontScale: 1,
  highContrast: false,
  reduceMotion: false,
};
const KEY = 'a11y-prefs';

function applyPrefs(p: Prefs) {
  const root = document.documentElement;
  root.style.fontSize = `${p.fontScale * 100}%`;
  root.classList.toggle('a11y-contrast', p.highContrast);
  root.classList.toggle('a11y-reduce-motion', p.reduceMotion);
}

export function AccessibilityButton() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const p = raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
      setPrefs(p);
      applyPrefs(p);
    } catch {
      applyPrefs(DEFAULTS);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    applyPrefs(prefs);
    try {
      localStorage.setItem(KEY, JSON.stringify(prefs));
    } catch {
      /* ignore */
    }
  }, [prefs, mounted]);

  const scales: Array<{ label: string; value: number }> = [
    { label: 'A', value: 1 },
    { label: 'A+', value: 1.15 },
    { label: 'A++', value: 1.3 },
  ];

  return (
    <>
      <button
        type='button'
        aria-label='Accessibility options'
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className='fixed bottom-5 right-5 z-[60] inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow ring-1 ring-primary/30 transition hover:scale-105 focus-visible:outline-none'
      >
        <Accessibility className='h-5 w-5' strokeWidth={2.25} />
      </button>

      {open && (
        <div
          role='dialog'
          aria-label='Accessibility settings'
          className={cn(
            'fixed bottom-20 right-5 z-[60] w-[calc(100vw-2.5rem)] max-w-sm rounded-2xl border border-border bg-surface p-4 shadow-elegant',
            'animate-reveal-scale-in'
          )}
        >
          <div className='mb-3 flex items-center justify-between'>
            <h2 className='text-sm font-semibold text-foreground'>
              Accessibility
            </h2>
            <button
              type='button'
              aria-label='Close accessibility panel'
              onClick={() => setOpen(false)}
              className='inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground'
            >
              <X className='h-4 w-4' />
            </button>
          </div>

          <div className='space-y-3'>
            <div>
              <div className='mb-1.5 flex items-center gap-2 text-xs font-medium text-muted-foreground'>
                <Type className='h-3.5 w-3.5' /> Text size
              </div>
              <div className='grid grid-cols-3 gap-1.5'>
                {scales.map((s) => (
                  <button
                    key={s.value}
                    type='button'
                    onClick={() =>
                      setPrefs((p) => ({ ...p, fontScale: s.value }))
                    }
                    className={cn(
                      'rounded-lg border px-2 py-2 text-sm font-medium transition',
                      prefs.fontScale === s.value
                        ? 'border-primary bg-primary-soft text-accent-foreground'
                        : 'border-border bg-surface-muted/60 text-foreground hover:border-border-strong'
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <ToggleRow
              icon={<Contrast className='h-3.5 w-3.5' />}
              label='High contrast'
              checked={prefs.highContrast}
              onChange={(v) => setPrefs((p) => ({ ...p, highContrast: v }))}
            />
            <ToggleRow
              icon={<MousePointer2 className='h-3.5 w-3.5' />}
              label='Reduce motion'
              checked={prefs.reduceMotion}
              onChange={(v) => setPrefs((p) => ({ ...p, reduceMotion: v }))}
            />

            <button
              type='button'
              onClick={() => setPrefs(DEFAULTS)}
              className='inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-surface-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground transition hover:text-foreground'
            >
              <RotateCcw className='h-3.5 w-3.5' /> Reset defaults
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function ToggleRow({
  icon,
  label,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className='flex cursor-pointer items-center justify-between rounded-lg border border-border bg-surface-muted/40 px-3 py-2.5'>
      <span className='flex items-center gap-2 text-sm text-foreground'>
        <span className='text-muted-foreground'>{icon}</span>
        {label}
      </span>
      <button
        type='button'
        role='switch'
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'flex h-6 w-11 items-center rounded-full p-1 transition-colors',
          checked ? 'bg-primary justify-end' : 'bg-secondary justify-start'
        )}
      >
        <span className='h-4 w-4 rounded-full bg-white shadow transition-all' />
      </button>
    </label>
  );
}
