import { render, screen } from '@testing-library/react';
import LandingPage from '@/app/(marketing)/page';

describe('Marketing landing page', () => {
  test('renders cyberpunk landing sections and main CTAs', () => {
    render(<LandingPage />);

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
});
