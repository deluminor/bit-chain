'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '@/hooks/useLogin';
import { cn } from '@/lib/utils';
import { CircleDollarSign, Lock } from 'lucide-react';

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const { register, handleSubmit, errors, isSubmitting, onSubmit } = useLogin();

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl border border-white/10 bg-white/60 shadow-2xl shadow-slate-900/10 ring-1 ring-white/20 backdrop-blur-2xl',
          'dark:border-white/10 dark:bg-zinc-900/45 dark:shadow-black/50 dark:ring-white/5',
        )}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-500/50 to-transparent"
          aria-hidden
        />
        <div className="px-6 pb-8 pt-8 sm:px-8 sm:pt-9">
          <div className="mb-6 flex flex-col items-center text-center sm:mb-7">
            <div
              className={cn(
                'mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500/90 to-teal-600/95 text-white shadow-lg shadow-emerald-500/25 ring-1 ring-white/20',
                'dark:from-emerald-500/80 dark:to-teal-600/90',
              )}
            >
              <CircleDollarSign className="h-6 w-6" strokeWidth={1.75} aria-hidden />
            </div>
            <h1 className="text-balance font-semibold text-2xl tracking-tight text-foreground sm:text-3xl">
              Welcome back
            </h1>
            <p className="mt-2 max-w-sm text-balance text-muted-foreground text-sm leading-relaxed sm:text-base">
              Sign in to your workspace — budgets, flow, and balance in one place.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid gap-6 sm:gap-7">
              <div className="grid gap-2.5">
                <Label
                  htmlFor="email"
                  className="text-foreground/90 text-sm font-medium sm:text-sm"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  disabled={isSubmitting}
                  className={cn(
                    'h-11 rounded-lg border-slate-200/90 bg-white/80 text-base sm:h-10 sm:text-sm',
                    'dark:border-white/10 dark:bg-zinc-950/50',
                  )}
                />
                {errors.email ? (
                  <p className="text-destructive text-sm" role="alert">
                    {errors.email.message}
                  </p>
                ) : null}
              </div>
              <div className="grid gap-2.5">
                <Label
                  htmlFor="password"
                  className="text-foreground/90 text-sm font-medium sm:text-sm"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register('password')}
                  disabled={isSubmitting}
                  className={cn(
                    'h-11 rounded-lg border-slate-200/90 bg-white/80 text-base sm:h-10 sm:text-sm',
                    'dark:border-white/10 dark:bg-zinc-950/50',
                  )}
                />
                {errors.password ? (
                  <p className="text-destructive text-sm" role="alert">
                    {errors.password.message}
                  </p>
                ) : null}
              </div>

              {errors.root ? (
                <p className="text-destructive text-sm" role="alert">
                  {errors.root.message}
                </p>
              ) : null}

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                variant="default"
                className={cn(
                  'mt-1 h-12 w-full rounded-lg border-0 font-semibold shadow-lg shadow-emerald-500/25 sm:h-11',
                  'bg-linear-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-600 dark:shadow-emerald-950/40',
                  'hover:opacity-[0.97] focus-visible:ring-emerald-400/40',
                )}
              >
                {isSubmitting ? 'Signing in…' : 'Sign in'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <p className="flex items-center justify-center gap-1.5 text-center text-muted-foreground text-xs sm:text-sm">
        <Lock className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
        <span>Encrypted session · your data stays private</span>
      </p>
    </div>
  );
}
