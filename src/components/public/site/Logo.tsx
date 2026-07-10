import { Activity } from 'lucide-react';
import Link from 'next/link';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link
      href='/'
      className={`inline-flex items-center gap-2 font-semibold tracking-tight ${className}`}
    >
      <span className='relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-elegant'>
        <Activity className='h-4 w-4' strokeWidth={2.5} />
      </span>
      <span className='text-[15px]'>DeadLink Watchdog</span>
    </Link>
  );
}
