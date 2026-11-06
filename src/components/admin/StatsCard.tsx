import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon?: React.ReactNode;
  /** Optional visual tone — purely presentational */
  tone?: 'primary' | 'accent' | 'destructive' | 'neutral';
  /** Optional index used to stagger the entrance animation */
  index?: number;
}

const toneStyles = {
  primary: {
    chip: 'bg-primary-soft text-primary',
    bar: 'bg-primary',
  },
  accent: {
    chip: 'bg-secondary-soft text-secondary',
    bar: 'bg-secondary',
  },
  destructive: {
    chip: 'bg-destructive/10 text-destructive',
    bar: 'bg-destructive',
  },
  neutral: {
    chip: 'bg-surface-muted text-foreground',
    bar: 'bg-border-strong',
  },
} as const;

export function StatsCard({
  title,
  value,
  description,
  icon,
  tone = 'neutral',
  index = 0,
}: StatsCardProps) {
  const styles = toneStyles[tone];

  return (
    <div
      className='group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-elegant animate-fade-up'
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
    >
      {/* left tone rail */}
      <span
        aria-hidden
        className={cn(
          'absolute inset-y-4 left-0 w-1 rounded-r-full transition-all duration-300 group-hover:inset-y-2',
          styles.bar
        )}
      />
      {/* faint dot texture */}
      <span
        aria-hidden
        className='pointer-events-none absolute -right-6 -top-6 size-28 rounded-full bg-dot opacity-40 mask-radial-fade'
      />

      <div className='relative flex items-start justify-between gap-3'>
        <p className='text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground'>
          {title}
        </p>
        {icon && (
          <span
            className={cn(
              'grid size-9 place-items-center rounded-xl transition-transform duration-300 group-hover:rotate-6 [&_svg]:size-4 [&_svg]:text-current',
              styles.chip
            )}
          >
            {icon}
          </span>
        )}
      </div>

      <div className='relative mt-4 font-display text-3xl font-semibold tracking-tight text-foreground font-mono-data'>
        {value}
      </div>
      {description && (
        <p className='relative mt-1.5 text-xs text-muted-foreground'>
          {description}
        </p>
      )}
    </div>
  );
}
