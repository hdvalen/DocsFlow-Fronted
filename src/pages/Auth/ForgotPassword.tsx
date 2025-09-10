import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';
import './Auth.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      // Lógica para enviar el correo de recuperación
      console.log('Sending reset link to:', email);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulación
      setMessage('Si el correo existe, recibirás un enlace para restablecer tu contraseña.');
    } catch (err) {
      setError('Ocurrió un error al enviar el correo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>¿Olvidaste tu Contraseña?</h2>
        <p className="subtitle">Introduce tu correo electrónico para restablecerla.</p>
        <form onSubmit={handleSubmit}>
          <Input
            label="Correo Electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="tu@empresa.com"
          />
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message auth-error">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Enlace'}
          </Button>
        </form>
        <p className="auth-link">
          <Link to="/login">Volver al inicio de sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;