import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../../context/AuthContext';
import { LoginForm } from '../LoginForm';

// Mockeamos la capa de servicios: basta con simular la llamada a la API,
// no hace falta levantar el backend ni simular toda la aplicación.
vi.mock('../../../services/authService', () => ({
  authService: {
    login: vi.fn(),
    me: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
}));

import { authService } from '../../../services/authService';

function renderLoginForm() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('LoginForm (integración)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('envía las credenciales ingresadas al completar y enviar el formulario', async () => {
    vi.mocked(authService.login).mockResolvedValueOnce({
      accessToken: 'fake-token',
      user: { id: '1', name: 'Jonathan', email: 'jonathan@test.com', role: 'user', createdAt: '2026-01-01' },
    });

    const user = userEvent.setup();
    renderLoginForm();

    await user.type(screen.getByLabelText(/correo/i), 'jonathan@test.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'secreta123');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: 'jonathan@test.com',
        password: 'secreta123',
      });
    });
  });

  it('muestra el mensaje de error que devuelve la API cuando el login falla', async () => {
    const { ApiError } = await import('../../../error/ApiError');
    vi.mocked(authService.login).mockRejectedValueOnce(new ApiError(401, 'Credenciales inválidas'));

    const user = userEvent.setup();
    renderLoginForm();

    await user.type(screen.getByLabelText(/correo/i), 'jonathan@test.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'incorrecta');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    expect(await screen.findByText('Credenciales inválidas')).toBeInTheDocument();
  });
});
