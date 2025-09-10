import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';
import './Auth.css';

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
      // Aquí iría la llamada a tu API de login
      console.log('Login attempt with:', { email, password });
      // Simulación de API con credenciales fijas
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (email === 'admin@admin.com' && password === 'admin') {
        localStorage.setItem('token', 'fake-admin-token');
        localStorage.setItem('role', 'admin');
        navigate('/documents');
      } else if (email === 'operator@docsflow.com' && password === 'operator') {
        localStorage.setItem('token', 'fake-operator-token');
        localStorage.setItem('role', 'operator');
        navigate('/documents');
      } else {
        setError('Credenciales inválidas. Intenta con admin@admin.com / admin');
      }
    } catch (err) {
      setError('Ocurrió un error al iniciar sesión.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
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
            placeholder="admin@admin.com"
          />
          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="admin"
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