import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';
import './Auth.css';

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>(); // Obtener el token de la URL
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setLoading(false);
      return;
    }

    try {
      // Lógica para restablecer la contraseña con el token y la nueva contraseña
      console.log('Resetting password for token:', token, 'with new password:', newPassword);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulación
      setMessage('Tu contraseña ha sido restablecida exitosamente.');
      setTimeout(() => navigate('/login'), 3000); // Redirigir al login
    } catch (err) {
      setError('Ocurrió un error al restablecer la contraseña o el token es inválido.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Restablecer Contraseña</h2>
        <p className="subtitle">Introduce tu nueva contraseña.</p>
        <form onSubmit={handleSubmit}>
          <Input
            label="Nueva Contraseña"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="********"
          />
          <Input
            label="Confirmar Contraseña"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="********"
          />
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message auth-error">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
          </Button>
        </form>
        <p className="auth-link">
          <Link to="/login">Volver al inicio de sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;