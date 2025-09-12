import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';
import './Auth.css';

const ResetPassword: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // extraer el token del query param
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/email/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: newPassword, confirm_password: confirmPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || 'Ocurrió un error al restablecer la contraseña');
      } else {
        setMessage(data.msg);
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
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
