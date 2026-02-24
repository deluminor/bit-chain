import { ROUTES } from '@/features/auth/constants';
import { loginSchema } from '@/features/auth/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type LoginFormData = z.infer<typeof loginSchema>;

export function useLogin() {
  const router = useRouter();
  const callbackUrl = ROUTES.DASHBOARD.path;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
        callbackUrl: ROUTES.DASHBOARD.path,
      });

      if (res?.error) {
        setError('root', {
          type: 'manual',
          message: 'Invalid email or password',
        });
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError('root', {
        type: 'manual',
        message: 'An error occurred. Please try again.',
      });
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
  };
}
