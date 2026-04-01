import { cache } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import QRCode from 'qrcode';
import { createClient } from '@/lib/supabase/server';
import { getEffectivePlan, getPlanLimits } from '@/lib/billing/plans';
import { LEDDisplay } from '@/components/led/led-display';
import { DisplayQrCode, Watermark } from '@/components/sign/watermark';
import { FullscreenButton } from '@/components/sign/fullscreen-button';
import type { AnimationType, LoopModeType, SpeedType } from '@/lib/utils/constants';
import type { PublicSign } from '@/lib/validations/sign';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const getSign = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from('signs')
    .select('slug, text, animation, led_color, bg_color, speed, loop_mode, restart_seconds, created_at, user_id')
    .eq('slug', slug)
    .single();
  return data as (PublicSign & { user_id: string | null }) | null;
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

  const plan = sign.user_id
    ? await getEffectivePlan(sign.user_id)
    : { tier: 'free' as const, limits: getPlanLimits('free') };
  const shouldShowOverlay = plan.limits.showDisplayOverlay;
  const landingUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const qrCodeDataUrl = shouldShowOverlay
    ? await QRCode.toDataURL(landingUrl, { margin: 1, width: 224 })
    : null;

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: sign.bg_color }}
    >
      <div className="flex flex-col items-center">
        <LEDDisplay
          text={sign.text}
          animation={sign.animation as AnimationType}
          ledColor={sign.led_color}
          bgColor={sign.bg_color}
          speed={sign.speed as SpeedType}
          loopMode={sign.loop_mode as LoopModeType}
          restartSeconds={sign.restart_seconds}
        />
        {shouldShowOverlay && <Watermark />}
        {shouldShowOverlay && qrCodeDataUrl && <DisplayQrCode qrCodeDataUrl={qrCodeDataUrl} />}
      </div>
      <FullscreenButton />
    </div>
  );
}
