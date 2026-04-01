import { cache } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { LEDDisplay } from '@/components/led/led-display';
import { Watermark } from '@/components/sign/watermark';
import { FullscreenButton } from '@/components/sign/fullscreen-button';
import type { AnimationType, SpeedType } from '@/lib/utils/constants';
import type { PublicSign } from '@/lib/validations/sign';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const getSign = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from('signs')
    .select('slug, text, animation, led_color, bg_color, speed, created_at')
    .eq('slug', slug)
    .single();
  return data as PublicSign | null;
});

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { slug } = await params;
  const sign = await getSign(slug);

  if (!sign) return { title: 'Sign não encontrado — Letry' };

  const title = sign.text.length > 60 ? `${sign.text.slice(0, 60)}...` : sign.text;
  const ogImageUrl = `/api/og/${slug}`;

  return {
    title: `${title} — Letry`,
    description: `Veja este letreiro digital: "${title}"`,
    openGraph: {
      title,
      description: 'Veja este letreiro digital animado',
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      images: [ogImageUrl],
    },
  };
};

export default async function DisplayPage({ params }: PageProps) {
  const { slug } = await params;
  const sign = await getSign(slug);

  if (!sign) notFound();

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: sign.bg_color }}
    >
      <LEDDisplay
        text={sign.text}
        animation={sign.animation as AnimationType}
        ledColor={sign.led_color}
        bgColor={sign.bg_color}
        speed={sign.speed as SpeedType}
      />
      <FullscreenButton />
      <Watermark />
    </div>
  );
}
