import type { ReactNode } from 'react';

interface DisplayLayoutProps {
  children: ReactNode;
}

export default function DisplayLayout({ children }: DisplayLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-950">
      {children}
    </div>
  );
}
