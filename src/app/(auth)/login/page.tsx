import Link from 'next/link';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import {
  AUTH_ERROR_FLAG,
  hasAuthError,
  LOGIN_ERROR_MESSAGE,
} from '@/lib/auth/errors';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { authSchema } from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const loginAction = async (formData: FormData) => {
  'use server';
  const parsed = authSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    redirect(`/login?error=${AUTH_ERROR_FLAG}`);
  }

  const requestHeaders = await headers();
  const rateLimit = await checkRateLimit({
    operation: 'auth:login',
    headersList: requestHeaders,
  });

  if (!rateLimit.success) {
    redirect(`/login?error=${AUTH_ERROR_FLAG}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    redirect(`/login?error=${AUTH_ERROR_FLAG}`);
  }

  redirect('/create');
};

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;
  const shouldShowError = hasAuthError(error);

  return (
    <div className="cp-panel rounded-xl border border-[var(--cp-border)] p-6">
      <h2 className="cp-heading mb-6 text-lg">Entrar</h2>
      <form action={loginAction} className="flex flex-col gap-4">
        <Input
          name="email"
          type="email"
          label="E-mail"
          placeholder="seu@email.com"
          required
          autoComplete="email"
        />
        <Input
          name="password"
          type="password"
          label="Senha"
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />
        {shouldShowError && (
          <p className="text-sm text-red-400">{LOGIN_ERROR_MESSAGE}</p>
        )}
        <Button type="submit" className="w-full mt-2">
          Entrar
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-zinc-300">
        Não tem conta?{' '}
        <Link href="/register" className="text-[var(--cp-cyan)] hover:text-[var(--cp-lime)]">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
