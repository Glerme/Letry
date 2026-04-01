/* eslint-disable @next/next/no-img-element */
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import MarketingLayout from '@/app/(marketing)/layout';
import AppLayout from '@/app/(app)/layout';
import AuthLayout from '@/app/(auth)/layout';
import { createClient } from '@/lib/supabase/server';

vi.mock('next/font/google', () => ({
  Orbitron: () => ({ variable: '--font-orbitron' }),
  Rajdhani: () => ({ variable: '--font-rajdhani' }),
}));

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img alt={props.alt ?? ''} {...props} />
  ),
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

describe('app branding logo', () => {
  it('renders logo image in marketing layout', async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn(async () => ({ data: { user: null }, error: null })),
      },
    } as never);

    render(
      await MarketingLayout({
        children: <div>marketing content</div>,
      })
    );

    expect(screen.getByAltText('Logo do Letry')).toBeTruthy();
  });

  it('renders logo image in app layout', () => {
    render(<AppLayout>app content</AppLayout>);
    expect(screen.getByAltText('Logo do Letry')).toBeTruthy();
  });

  it('renders logo image in auth layout', () => {
    render(<AuthLayout>auth content</AuthLayout>);
    expect(screen.getByAltText('Logo do Letry')).toBeTruthy();
  });
});
