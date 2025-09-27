import { LoginForm } from '@/components/auth-forms';

export default function LoginPage() {
  return (
    <div className="container flex min-h-[calc(100vh-theme(spacing.14))] items-center justify-center py-12">
      <LoginForm />
    </div>
  );
}
