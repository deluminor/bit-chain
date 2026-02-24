import { ROUTES } from '@/features/auth/constants';
import { redirect } from 'next/navigation';

export default function NotFound() {
  redirect(ROUTES.LOGIN.path);
}
