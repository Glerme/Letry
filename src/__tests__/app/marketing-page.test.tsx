import { render, screen } from '@testing-library/react';
import LandingPage from '@/app/(marketing)/page';
import { createClient } from '@/lib/supabase/server';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

describe('Marketing landing page', () => {
  test('renders cyberpunk landing sections and main CTAs', async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn(async () => ({
          data: { user: null },
          error: null,
        })),
      },
    } as never);

    render(await LandingPage());

    expect(
      screen.getByRole('heading', {
        name: /Seu letreiro LED com estética cyberpunk/i,
      }),
    ).toBeTruthy();

    expect(screen.getByRole('heading', { name: /Recursos para dominar o palco/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /Planos para cada fase/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /Perguntas frequentes/i })).toBeTruthy();

    const createLinks = screen.getAllByRole('link', { name: /Criar letreiro grátis/i });
    expect(createLinks.length).toBeGreaterThan(0);
    createLinks.forEach((link) => {
      expect(link.getAttribute('href')).toBe('/create');
    });
  });

  test('shows dashboard link when user is authenticated', async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn(async () => ({
          data: { user: { id: 'user-1' } },
          error: null,
        })),
      },
    } as never);

    render(await LandingPage());

    const dashboardLinks = screen.getAllByRole('link', { name: /Meu painel/i });
    expect(dashboardLinks.length).toBeGreaterThan(0);
    dashboardLinks.forEach((link) => {
      expect(link.getAttribute('href')).toBe('/dashboard');
    });
  });
});
