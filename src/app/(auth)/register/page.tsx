import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const registerAction = async (formData: FormData) => {
  'use server';
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/register?error=${encodeURIComponent(error.message)}`);
  }

  redirect('/register?success=1');
};

interface RegisterPageProps {
  searchParams: Promise<{ error?: string; success?: string }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { error, success } = await searchParams;

  if (success) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-center">
        <h2 className="text-lg font-semibold text-white mb-2">Verifique seu e-mail</h2>
        <p className="text-zinc-400 text-sm">
          Enviamos um link de confirmação para o seu e-mail.
        </p>
        <Link href="/login" className="mt-4 inline-block text-orange-400 hover:text-orange-300 text-sm">
          Voltar ao login
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="text-lg font-semibold text-white mb-6">Criar conta</h2>
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
        {error && (
          <p className="text-sm text-red-400">{decodeURIComponent(error)}</p>
        )}
        <Button type="submit" className="w-full mt-2">
          Criar conta
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-zinc-400">
        Já tem conta?{' '}
        <Link href="/login" className="text-orange-400 hover:text-orange-300">
          Entrar
        </Link>
      </p>
    </div>
  );
}
