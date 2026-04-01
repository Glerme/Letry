import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import {
  FAQSection,
  FeaturesSection,
  FinalCTASection,
  HeroSection,
  PreviewSection,
  PricingSection,
} from '@/components/marketing';

export const metadata: Metadata = {
  title: 'Letry — Letreiros digitais animados',
  description:
    'Crie letreiros digitais animados com efeitos LED, escolha cores, velocidade e animações. Compartilhe com um link ou exiba em tela cheia. Gratuito para começar.',
  alternates: {
    canonical: '/',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://letry.app'}/#organization`,
      name: 'Letry',
      url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://letry.app',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://letry.app'}/icon.svg`,
      },
    },
    {
      '@type': 'WebApplication',
      '@id': `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://letry.app'}/#webapp`,
      name: 'Letry',
      url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://letry.app',
      description:
        'Crie letreiros digitais animados com efeitos LED e compartilhe com um link.',
      applicationCategory: 'DesignApplication',
      operatingSystem: 'Web',
      inLanguage: 'pt-BR',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'BRL',
        description: 'Plano gratuito disponível',
      },
      publisher: {
        '@id': `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://letry.app'}/#organization`,
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://letry.app'}/#website`,
      url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://letry.app',
      name: 'Letry',
      inLanguage: 'pt-BR',
      publisher: {
        '@id': `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://letry.app'}/#organization`,
      },
    },
  ],
};

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-6 py-14 sm:py-20">
        <HeroSection isAuthenticated={Boolean(user)} />
        <PreviewSection />
        <FeaturesSection />
        <PricingSection />
        <FAQSection />
        <FinalCTASection />
      </div>
    </>
  );
}
