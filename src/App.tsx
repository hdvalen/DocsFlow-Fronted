import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Login from './pages/Auth/Login';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import DocumentList from './pages/Documents/DocumentList';
import Navbar from './components/Navbar';
import './App.css'; // Estilos específicos de App

// Layout para páginas con Navbar
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
  const [isAdmin, setIsAdmin] = useState<boolean>(localStorage.getItem('role') === 'admin');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Esto se podría mejorar con un contexto de autenticación o una validación de token
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    setIsAuthenticated(!!token);
    setIsAdmin(role === 'admin');

    // Redireccionar si no está autenticado y no está en una ruta pública
    if (!token && !['/login', '/forgot-password', '/reset-password'].includes(location.pathname)) {
      navigate('/login');
    }
  }, [location.pathname, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate('/login');
  };

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} isAdmin={isAdmin} onLogout={handleLogout} />
      <main className="main-content">
        {children}
      </main>
    </>
  );
};


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Rutas Privadas (envueltas en el Layout) */}
        <Route path="/" element={<Layout><DocumentList /></Layout>} />
        <Route path="/documents" element={<Layout><DocumentList /></Layout>} />
        {/* Agrega más rutas para visualización detallada de documentos, gestión de usuarios, etc. */}
        {/* <Route path="/documents/:id" element={<Layout><DocumentDetail /></Layout>} /> */}
        {/* <Route path="/users" element={<Layout><UserManagement /></Layout>} /> (Solo para admin) */}
      </Routes>
    </Router>
  );
};

export default App;