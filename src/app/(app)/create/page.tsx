import type { Metadata } from 'next';
import { SignForm } from '@/components/sign/sign-form';

export const metadata: Metadata = {
  title: 'Criar letreiro — Letry',
};

export default function CreatePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Criar letreiro</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Personalize seu letreiro e compartilhe com um link único.
        </p>
      </div>
      <SignForm />
    </div>
  );
}
