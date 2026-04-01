import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) => {
  const { slug } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('signs')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Sign não encontrado' }, { status: 404 });
  }

  return NextResponse.json(data);
};
