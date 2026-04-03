import type { ReactNode } from 'react';
import { Orbitron, Rajdhani } from 'next/font/google';
import { LetryLogo } from '@/components/brand/letry-logo';

interface AuthLayoutProps {
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

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div
      className={`${orbitron.variable} ${rajdhani.variable} cp-root min-h-screen [font-family:var(--font-rajdhani)]`}
    >
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_10%_0%,rgba(70,246,255,0.2),transparent_40%),radial-gradient(circle_at_90%_100%,rgba(255,73,201,0.2),transparent_44%),linear-gradient(180deg,#05070d_0%,#090312_65%,#03020b_100%)]" />
      <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center">
            <LetryLogo className="h-16 w-16 mix-blend-screen" priority />
          </div>
          <p className="mt-1 text-sm text-zinc-300">Letreiros digitais animados</p>
        </div>
        {children}
      </div>
    </div>
    </div>
  );
}
