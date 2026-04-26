import { AnimatedDiv } from '@/components/ui/animations';
import { LoginAmbientShell } from '@/features/auth/components/LoginAmbientShell';
import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <AnimatedDiv variant="slideUp" className="min-h-svh">
      <LoginAmbientShell>
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </LoginAmbientShell>
    </AnimatedDiv>
  );
}
