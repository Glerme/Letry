import type { Metadata } from 'next';
import { SignForm } from '@/components/sign/sign-form';

export const metadata: Metadata = {
  title: 'Criar letreiro — Letry',
};

export default function CreatePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="cp-heading text-2xl">Criar letreiro</h1>
        <p className="mt-1 text-sm text-zinc-300">
          Personalize seu letreiro e compartilhe com um link único.
        </p>
      </div>
      <SignForm />
    </div>
  );
}
