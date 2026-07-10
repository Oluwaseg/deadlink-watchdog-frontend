'use client';
import { cn } from '@/lib/utils';
import {
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

/* ------------------------------------------------------------------ */
/* Shared scroll scheduler — one rAF, one scroll listener for the app */
/* ------------------------------------------------------------------ */

type ScrollSub = (scrollY: number, vh: number) => void;
const subs = new Set<ScrollSub>();
let rafId = 0;
let installed = false;

function schedule() {
  if (rafId) return;
  rafId = requestAnimationFrame(() => {
    rafId = 0;
    const y = window.scrollY;
    const vh = window.innerHeight;
    subs.forEach((fn) => fn(y, vh));
  });
}

function installScrollListener() {
  if (installed || typeof window === 'undefined') return;
  installed = true;
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
}

function subscribe(fn: ScrollSub) {
  installScrollListener();
  subs.add(fn);
  schedule();
  return () => {
    subs.delete(fn);
  };
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function isCoarsePointer() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: none), (max-width: 768px)').matches
  );
}

/* ------------------------------------------------------------------ */
/* Reveal                                                              */
/* ------------------------------------------------------------------ */

export type RevealVariant =
  | 'fade-up'
  | 'fade-in'
  | 'slide-left'
  | 'slide-right'
  | 'scale-in'
  | 'blur-in';

interface RevealProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  delay?: number;
  variant?: RevealVariant;
  as?: 'div' | 'section' | 'article' | 'header' | 'li' | 'ol' | 'ul';
  once?: boolean;
}

const variantClass: Record<RevealVariant, string> = {
  'fade-up': 'animate-reveal-fade-up',
  'fade-in': 'animate-reveal-fade-in',
  'slide-left': 'animate-reveal-slide-left',
  'slide-right': 'animate-reveal-slide-right',
  'scale-in': 'animate-reveal-scale-in',
  'blur-in': 'animate-reveal-blur-in',
};

const initialClass: Record<RevealVariant, string> = {
  'fade-up': 'opacity-0 translate-y-4',
  'fade-in': 'opacity-0',
  'slide-left': 'opacity-0 -translate-x-6',
  'slide-right': 'opacity-0 translate-x-6',
  'scale-in': 'opacity-0 scale-[0.96]',
  'blur-in': 'opacity-0 blur-md',
};

export function Reveal({
  children,
  delay = 0,
  variant = 'fade-up',
  className,
  as = 'div',
  once = true,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined' || prefersReducedMotion()) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          if (once) io.disconnect();
        } else if (!once) {
          setShown(false);
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    );
    io.observe(el);

    return () => io.disconnect();
  }, [once]);

  const Comp = as as 'div';
  return (
    <Comp
      ref={ref as never}
      style={{ animationDelay: shown ? `${delay}ms` : undefined }}
      className={cn(
        // Only hint the compositor while the element is animating in.
        !shown && 'will-change-[transform,opacity]',
        shown ? variantClass[variant] : initialClass[variant],
        className
      )}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/* ------------------------------------------------------------------ */
/* Parallax — transform-only, gated by IO + coarse-pointer / RM       */
/* ------------------------------------------------------------------ */

export function Parallax({
  children,
  speed = 0.15,
  className,
  disableOnMobile = true,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
  disableOnMobile?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    if (disableOnMobile && isCoarsePointer()) return;

    let visible = false;
    let lastY = -1;

    const update = (_y: number, vh: number) => {
      if (!visible) return;
      // getBoundingClientRect is read once per rAF frame from the shared scheduler.
      const rect = el.getBoundingClientRect();
      const progress = (rect.top + rect.height / 2) / vh - 0.5;
      const ty = (-progress * speed * 100).toFixed(2);
      if (ty === String(lastY)) return;
      lastY = Number(ty);
      el.style.transform = `translate3d(0, ${ty}px, 0)`;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        el.style.willChange = visible ? 'transform' : 'auto';
      },
      { rootMargin: '120px 0px' }
    );
    io.observe(el);

    const unsub = subscribe(update);
    return () => {
      io.disconnect();
      unsub();
      el.style.willChange = 'auto';
      el.style.transform = '';
    };
  }, [speed, disableOnMobile]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ScrollProgress — single rAF, transform-only                        */
/* ------------------------------------------------------------------ */

export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let last = -1;

    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? h.scrollTop / max : 0;
      if (Math.abs(p - last) < 0.002) return;
      last = p;
      el.style.transform = `scaleX(${p})`;
    };

    return subscribe(update);
  }, []);

  return (
    <div
      aria-hidden
      className='pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left'
    >
      <div
        ref={ref}
        style={{ transform: 'scaleX(0)', willChange: 'transform' }}
        className='h-full w-full origin-left bg-gradient-to-r from-primary via-primary to-secondary'
      />
    </div>
  );
}
