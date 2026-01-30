import { LoginForm } from '@/components/auth/login-form';
import { WashWiseLogo } from '@/components/wash-wise-logo';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-4">
      <div className="mb-6">
        <Link href="/">
          <WashWiseLogo />
        </Link>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>Bem-vindo de volta!</CardTitle>
          <CardDescription>
            Entre na sua conta para continuar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <div className="mt-4 text-center text-sm">
            Não tem uma conta?{' '}
            <Link href="/auth/register" className="underline">
              Cadastre-se
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
