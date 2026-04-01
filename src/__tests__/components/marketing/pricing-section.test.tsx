import { render, screen } from '@testing-library/react';
import { PricingSection } from '@/components/marketing/pricing-section';

describe('PricingSection', () => {
  test('renders highlighted pro plan with a popularity badge', () => {
    render(<PricingSection />);

    expect(screen.getByRole('heading', { name: /Planos para cada fase/i })).toBeTruthy();
    expect(screen.getByText(/Mais popular/i)).toBeTruthy();
    expect(screen.getByRole('link', { name: /Fazer upgrade/i }).getAttribute('href')).toBe('/dashboard');
  });
});
