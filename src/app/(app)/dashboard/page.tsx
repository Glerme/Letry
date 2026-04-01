import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { SignCard } from '@/components/sign/sign-card';
import { Button } from '@/components/ui/button';
import type { OwnedSign } from '@/lib/validations/sign';

export const metadata: Metadata = {
  title: 'Meus letreiros — Letry',
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: signs } = await supabase
    .from('signs')
    .select('id, slug, text, animation, led_color, bg_color, speed, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const signList = (signs ?? []) as OwnedSign[];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Meus letreiros</h1>
          <p className="text-zinc-400 text-sm mt-1">
            {signList.length === 0
              ? 'Nenhum letreiro ainda.'
              : `${signList.length} letreiro${signList.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Link href="/create">
          <Button>Criar letreiro</Button>
        </Link>
      </div>

      {signList.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-700 p-12 text-center">
          <p className="text-zinc-500 mb-4">Crie seu primeiro letreiro!</p>
          <Link href="/create">
            <Button variant="secondary">Criar agora</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {signList.map((sign) => (
            <SignCard key={sign.id} sign={sign} />
          ))}
        </div>
      )}
    </div>
  );
}
