import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { SignForm } from '@/components/sign/sign-form';
import { getEffectivePlan } from '@/lib/billing/plans';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Criar letreiro — Letry',
};

export default function CreatePage() {
  return <CreatePageContent />;
}

const CreatePageContent = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const [plan, signsCountResult] = await Promise.all([
    getEffectivePlan(user.id),
    supabase.from('signs').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
  ]);

  const signsCount = signsCountResult.count ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="cp-heading text-2xl">Criar letreiro</h1>
        <p className="mt-1 text-sm text-zinc-300">
          Personalize seu letreiro e compartilhe com um link único.
        </p>
      </div>
      <SignForm planTier={plan.tier} signsCount={signsCount} />
    </div>
  );
};
