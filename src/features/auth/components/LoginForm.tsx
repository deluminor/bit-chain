'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '@/hooks/useLogin';
import { cn } from '@/lib/utils';
// import Link from 'next/link';
// import { ROUTES } from '../constants';

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const { register, handleSubmit, errors, isSubmitting, onSubmit } = useLogin();

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome</CardTitle>
          <CardDescription>Login with your email and password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register('email')}
                    disabled={isSubmitting}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>
                <div className="grid gap-2">
                  {/* <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href={ROUTES.FORGOT_PASSWORD.path}
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div> */}
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    {...register('password')}
                    disabled={isSubmitting}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>

                {errors.root && <p className="text-sm text-red-500">{errors.root.message}</p>}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
                </Button>
              </div>

              {/* <div className="text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link href={ROUTES.REGISTER.path} className="underline underline-offset-4">
                  Sign up
                </Link>
              </div> */}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
