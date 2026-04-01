import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PasswordInput } from '@/components/ui/password-input';

describe('PasswordInput', () => {
  it('toggles visibility between password and text', () => {
    render(<PasswordInput id="password" name="password" label="Senha" />);

    const input = screen.getByLabelText('Senha') as HTMLInputElement;
    expect(input.type).toBe('password');

    const showButton = screen.getByRole('button', { name: 'Mostrar senha' });
    fireEvent.click(showButton);
    expect(input.type).toBe('text');

    const hideButton = screen.getByRole('button', { name: 'Ocultar senha' });
    fireEvent.click(hideButton);
    expect(input.type).toBe('password');
  });
});
