import Link from 'next/link';
import type { ReactNode } from 'react';
import { Orbitron, Rajdhani } from 'next/font/google';
import { LetryLogo } from '@/components/brand/letry-logo';

interface AppLayoutProps {
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

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div
      className={`${orbitron.variable} ${rajdhani.variable} cp-root min-h-screen [font-family:var(--font-rajdhani)]`}
    >
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_10%_0%,rgba(70,246,255,0.2),transparent_40%),radial-gradient(circle_at_90%_100%,rgba(255,73,201,0.2),transparent_44%),linear-gradient(180deg,#05070d_0%,#090312_65%,#03020b_100%)]" />
      <header className="sticky top-0 z-20 border-b border-[var(--cp-border)] bg-black/45 px-6 py-4 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" aria-label="Ir para a página inicial" className="inline-flex items-center">
            <LetryLogo className="h-10 w-10 mix-blend-screen" priority />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm uppercase tracking-[0.12em] text-zinc-300 transition-colors hover:text-white"
            >
              Meus letreiros
            </Link>
            <Link
              href="/create"
              className="cp-button-secondary text-sm"
            >
              Criar
            </Link>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
