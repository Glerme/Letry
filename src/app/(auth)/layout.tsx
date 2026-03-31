import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-orange-500">Letry</h1>
          <p className="text-zinc-400 text-sm mt-1">Letreiros digitais animados</p>
        </div>
        {children}
      </div>
    </div>
  );
}
