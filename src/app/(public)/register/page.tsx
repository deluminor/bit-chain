import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { AnimatedDiv } from '@/components/ui/animations';

export default function RegisterPage() {
  return (
    <AnimatedDiv
      variant="slideUp"
      className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10"
    >
      <div className="flex w-full max-w-sm flex-col gap-6">
        <RegisterForm />
      </div>
    </AnimatedDiv>
  );
}
