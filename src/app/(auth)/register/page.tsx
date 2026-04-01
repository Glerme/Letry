import Link from 'next/link';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import {
  AUTH_ERROR_FLAG,
  hasAuthError,
  REGISTER_ERROR_MESSAGE,
} from '@/lib/auth/errors';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { authSchema } from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const registerAction = async (formData: FormData) => {
  'use server';
  const parsed = authSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    redirect(`/register?error=${AUTH_ERROR_FLAG}`);
  }

  const requestHeaders = await headers();
  const rateLimit = await checkRateLimit({
    operation: 'auth:register',
    headersList: requestHeaders,
  });

  if (!rateLimit.success) {
    redirect(`/register?error=${AUTH_ERROR_FLAG}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/register?error=${AUTH_ERROR_FLAG}`);
  }

  redirect('/register?success=1');
};

interface RegisterPageProps {
  searchParams: Promise<{ error?: string; success?: string }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { error, success } = await searchParams;
  const shouldShowError = hasAuthError(error);

  if (success) {
    return (
      <div className="cp-panel rounded-xl border border-[var(--cp-border)] p-6 text-center">
        <h2 className="cp-heading mb-2 text-lg">Verifique seu e-mail</h2>
        <p className="text-sm text-zinc-300">
          Enviamos um link de confirmação para o seu e-mail.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-block text-sm text-[var(--cp-cyan)] hover:text-[var(--cp-lime)]"
        >
          Voltar ao login
        </Link>
      </div>
    );
  }

  return (
    <div className="cp-panel rounded-xl border border-[var(--cp-border)] p-6">
      <h2 className="cp-heading mb-6 text-lg">Criar conta</h2>
      <form action={registerAction} className="flex flex-col gap-4">
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
          placeholder="Mínimo 6 caracteres"
          required
          minLength={6}
          autoComplete="new-password"
        />
        {shouldShowError && (
          <p className="text-sm text-red-400">{REGISTER_ERROR_MESSAGE}</p>
        )}
        <Button type="submit" className="w-full mt-2">
          Criar conta
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-zinc-300">
        Já tem conta?{' '}
        <Link href="/login" className="text-[var(--cp-cyan)] hover:text-[var(--cp-lime)]">
          Entrar
        </Link>
      </p>
    </div>
  );
}
