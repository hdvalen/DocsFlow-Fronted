import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';
import './Auth.css';
import BackgroundStars from '../../components/Background';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/Auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Error en el login');
      }

      const data = await response.json();

      // 🔑 Guardamos token y user en localStorage
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('role', data.user.role);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirigir al dashboard
      navigate('/documents');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Ocurrió un error al iniciar sesión.');
      } else {
        setError('Ocurrió un error al iniciar sesión.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <BackgroundStars />

      <div className="auth-card">
        <h2>Iniciar Sesión</h2>
        <p className="subtitle">Accede a tu plataforma DocsFlow.</p>
        <form onSubmit={handleSubmit}>
          <Input
            label="Correo Electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="correo"
          />
          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="contraseña"
          />
          {error && <p className="error-message auth-error">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </Button>
        </form>
        <p className="auth-link">
          ¿Olvidaste tu contraseña? <Link to="/forgot-password">Recuperar</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
