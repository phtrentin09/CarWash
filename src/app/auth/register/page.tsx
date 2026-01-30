import { RegisterForm } from '@/components/auth/register-form';
import { WashWiseLogo } from '@/components/wash-wise-logo';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-4">
      <div className="mb-6">
        <Link href="/">
          <WashWiseLogo />
        </Link>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>Crie sua conta</CardTitle>
          <CardDescription>
            É rápido e fácil. Vamos começar!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{' '}
            <Link href="/auth/login" className="underline">
              Entrar
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
