import Link from 'next/link';
import type { ReactNode } from 'react';
import { Orbitron, Rajdhani } from 'next/font/google';
import { createClient } from '@/lib/supabase/server';

interface MarketingLayoutProps {
  children: ReactNode;
}

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-orbitron',
});

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-rajdhani',
});

export default async function MarketingLayout({ children }: MarketingLayoutProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const authNav = user
    ? { href: '/dashboard', label: 'Meu painel' }
    : { href: '/login', label: 'Entrar' };

  return (
    <div
      className={`${orbitron.variable} ${rajdhani.variable} cp-root min-h-screen bg-zinc-950 [font-family:var(--font-rajdhani)]`}
    >
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_10%_0%,rgba(70,246,255,0.2),transparent_40%),radial-gradient(circle_at_90%_100%,rgba(255,73,201,0.2),transparent_44%),linear-gradient(180deg,#05070d_0%,#090312_65%,#03020b_100%)]" />
      <header className="sticky top-0 z-20 border-b border-[var(--cp-border)] bg-black/45 px-6 py-4 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="cp-heading text-xl font-black uppercase text-[var(--cp-cyan)]">
            Letry
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href={authNav.href}
              className="text-sm uppercase tracking-[0.14em] text-zinc-300 transition-colors hover:text-white"
            >
              {authNav.label}
            </Link>
            <Link
              href="/create"
              className="cp-button-secondary text-sm"
            >
              Criar letreiro
            </Link>
          </div>
        </nav>
      </header>
      <main className="relative z-10 flex-1">{children}</main>
      <footer className="border-t border-[var(--cp-border)] px-6 py-5 text-center">
        <p className="text-sm uppercase tracking-[0.12em] text-zinc-500">
          © {new Date().getFullYear()} Letry.
        </p>
      </footer>
    </div>
  );
}
