import { render, screen } from '@testing-library/react';
import { HeroSection } from '@/components/marketing/hero-section';

describe('HeroSection', () => {
  test('shows login action for anonymous users', () => {
    render(<HeroSection isAuthenticated={false} />);

    const loginLink = screen.getByRole('link', { name: /Entrar/i });
    expect(loginLink.getAttribute('href')).toBe('/login');
  });

  test('shows dashboard action for authenticated users', () => {
    render(<HeroSection isAuthenticated />);

    const dashboardLink = screen.getByRole('link', { name: /Meu painel/i });
    expect(dashboardLink.getAttribute('href')).toBe('/dashboard');
  });
});
