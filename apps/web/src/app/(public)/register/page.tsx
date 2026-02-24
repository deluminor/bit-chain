import { redirect } from 'next/navigation';

// Registration is temporarily disabled
export default function RegisterPage() {
  redirect('/login');
}
