'use client';

import { cn } from '@/lib/utils';
import { THEME, useStore } from '@/store';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';

type LoginAmbientShellProps = {
  children: React.ReactNode;
  className?: string;
};

const GRID = '32px 32px';

const gridLightDim =
  'linear-gradient(rgba(15,23,42,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.08) 1px, transparent 1px)';
const gridDarkDim =
  'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)';
const gridLightNear =
  'linear-gradient(rgba(15,23,42,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.22) 1px, transparent 1px)';
const gridDarkNear =
  'linear-gradient(rgba(255,255,255,0.24) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.24) 1px, transparent 1px)';

function baseGridStyle(image: string): CSSProperties {
  return {
    backgroundImage: image,
    backgroundSize: GRID,
    backgroundPosition: '0 0',
  };
}

function nearGridStyle(bright: string, mx: string, my: string): CSSProperties {
  const mask = `radial-gradient(circle 5.5rem at ${mx} ${my}, #000, transparent 72%)`;
  return {
    ...baseGridStyle(bright),
    WebkitMaskImage: mask,
    maskImage: mask,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskSize: '100% 100%',
    maskSize: '100% 100%',
  };
}

export function LoginAmbientShell({ children, className }: LoginAmbientShellProps) {
  const theme = useStore(s => s.theme);
  const isDark = theme === THEME.DARK;
  const dim = isDark ? gridDarkDim : gridLightDim;
  const near = isDark ? gridDarkNear : gridLightNear;

  const rootRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [mx, setMx] = useState('50%');
  const [my, setMy] = useState('50%');
  const [active, setActive] = useState(false);

  const update = useCallback((clientX: number, clientY: number) => {
    const el = rootRef.current;

    if (!el) {
      return;
    }

    const r = el.getBoundingClientRect();
    const w = r.width || 1;
    const h = r.height || 1;

    setMx(`${((clientX - r.left) / w) * 100}%`);
    setMy(`${((clientY - r.top) / h) * 100}%`);
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        update(e.clientX, e.clientY);
      });
    },
    [update],
  );

  useEffect(() => {
    return () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={cn(
        'relative min-h-svh overflow-hidden bg-slate-100 text-foreground',
        isDark && 'bg-zinc-950',
        className,
      )}
      onPointerEnter={() => setActive(true)}
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        setActive(false);
        setMx('50%');
        setMy('50%');
        if (rafRef.current != null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      }}
    >
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <div
          className={cn(
            'absolute -left-[20%] -top-20 h-[min(100vw,32rem)] w-[min(100vw,32rem)] animate-login-orb-a rounded-full bg-emerald-400/30 blur-3xl will-change-transform',
            isDark && 'left-0 top-0 h-112 w-md bg-emerald-500/20',
          )}
        />
        <div
          className={cn(
            'absolute -right-[15%] bottom-0 h-88 w-88 animate-login-orb-b rounded-full bg-violet-500/25 blur-3xl will-change-transform',
            isDark && 'bottom-[-5%] right-0 h-104 w-104 bg-violet-600/20',
          )}
        />
        <div
          className={cn(
            'absolute left-1/2 top-1/3 h-px w-[min(80%,24rem)] -translate-x-1/2 bg-linear-to-r from-transparent to-transparent',
            isDark ? 'via-emerald-400/15' : 'via-emerald-500/20',
          )}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden>
        <div className="absolute inset-0" style={baseGridStyle(dim)} />
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-200',
            active ? 'opacity-100' : 'opacity-0',
          )}
          style={nearGridStyle(near, mx, my)}
        />
      </div>

      <div className="relative z-10 flex min-h-svh flex-col items-center justify-center p-4 sm:p-6 md:p-10">
        {children}
      </div>
    </div>
  );
}
