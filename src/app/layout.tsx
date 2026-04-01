import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://letry.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Letry — Letreiros digitais animados',
    template: '%s | Letry',
  },
  description:
    'Crie letreiros digitais animados com efeitos LED, escolha cores, velocidade e animações. Compartilhe com um link ou exiba em tela cheia.',
  keywords: [
    'letreiro digital',
    'letreiro animado',
    'letreiro LED',
    'painel LED online',
    'criar letreiro',
    'letreiro digital grátis',
    'animação de texto',
    'display LED',
  ],
  authors: [{ name: 'Letry', url: siteUrl }],
  creator: 'Letry',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'Letry — Letreiros digitais animados',
    description:
      'Crie letreiros digitais animados com efeitos LED e compartilhe com um link.',
    type: 'website',
    url: siteUrl,
    siteName: 'Letry',
    locale: 'pt_BR',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Letry — Letreiros digitais animados',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Letry — Letreiros digitais animados',
    description:
      'Crie letreiros digitais animados com efeitos LED e compartilhe com um link.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
