'use client';

import { LayoutGrid, Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export function ModeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const active = (theme ?? 'system') as 'light' | 'dark' | 'system';
  const isDark = mounted ? resolvedTheme === 'dark' : false;

  const options = [
    { key: 'light' as const, label: 'Light', Icon: Sun },
    { key: 'system' as const, label: 'System', Icon: Monitor },
    { key: 'dark' as const, label: 'Dark', Icon: Moon },
  ];

  const activeIndex = options.findIndex((o) => o.key === active);

  return (
    <div className={cn('fixed bottom-5 left-5 z-50', className)}>
      {/* Ambient glow */}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute -inset-3 rounded-full opacity-70 blur-2xl transition-opacity duration-500',
          isDark
            ? 'bg-[radial-gradient(circle_at_50%_50%,theme(colors.indigo.500/0.35),transparent_70%)]'
            : 'bg-[radial-gradient(circle_at_50%_50%,theme(colors.amber.300/0.45),transparent_70%)]'
        )}
      />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type='button'
            aria-label='Change theme'
            title='Theme'
            className={cn(
              'relative grid h-11 w-11 place-items-center rounded-full',
              'border border-border/60 bg-background/70 text-foreground/80',
              'shadow-[0_8px_30px_-8px_rgba(0,0,0,0.35)] ring-1 ring-black/5 backdrop-blur-xl',
              'supports-[backdrop-filter]:bg-background/50',
              'transition-all duration-200 hover:text-foreground hover:scale-105',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
              open && 'text-foreground scale-105'
            )}
          >
            <LayoutGrid
              className={cn(
                'h-[18px] w-[18px] transition-transform duration-300',
                open && 'rotate-45'
              )}
              strokeWidth={2.25}
            />
            {/* Active-theme dot */}
            <span
              aria-hidden
              className={cn(
                'absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-background',
                active === 'light' && 'bg-amber-400',
                active === 'dark' && 'bg-indigo-400',
                active === 'system' && 'bg-muted-foreground'
              )}
            />
          </button>
        </PopoverTrigger>

        <PopoverContent
          side='top'
          align='start'
          sideOffset={10}
          className={cn(
            'w-auto rounded-2xl border border-border/60 bg-background/80 p-2',
            'shadow-[0_16px_40px_-12px_rgba(0,0,0,0.35)] ring-1 ring-black/5 backdrop-blur-xl',
            'supports-[backdrop-filter]:bg-background/60'
          )}
        >
          <div
            role='radiogroup'
            aria-label='Theme'
            className='relative flex items-center gap-1'
          >
            {/* Sliding pill */}
            <span
              aria-hidden
              className={cn(
                'absolute top-0 bottom-0 w-9 rounded-full bg-primary/10 ring-1 ring-primary/25',
                'shadow-[inset_0_1px_0_theme(colors.white/0.4)] transition-[left,background-color] duration-300 ease-out'
              )}
              style={{
                left: `calc(${activeIndex} * (2.25rem + 0.25rem))`,
              }}
            />

            {options.map(({ key, label, Icon }) => {
              const isActive = active === key;
              return (
                <button
                  key={key}
                  type='button'
                  role='radio'
                  aria-checked={isActive}
                  aria-label={label}
                  title={label}
                  onClick={() => setTheme(key)}
                  className={cn(
                    'group relative z-10 grid h-9 w-9 place-items-center rounded-full',
                    'text-muted-foreground transition-all duration-200',
                    'hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                    isActive && 'text-foreground'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4 transition-transform duration-300',
                      isActive
                        ? 'scale-110'
                        : 'scale-100 group-hover:scale-110',
                      key === 'light' &&
                        isActive &&
                        'text-amber-500 [filter:drop-shadow(0_0_6px_theme(colors.amber.400/0.7))]',
                      key === 'dark' &&
                        isActive &&
                        'text-indigo-400 [filter:drop-shadow(0_0_6px_theme(colors.indigo.400/0.7))]'
                    )}
                    strokeWidth={2.25}
                  />
                </button>
              );
            })}
          </div>

          <div className='mt-1.5 text-center text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/80'>
            {mounted ? active : '—'}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
