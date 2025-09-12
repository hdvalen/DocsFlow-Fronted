import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Ajusta la ruta si es necesario

// Páginas
import Login from './pages/Auth/Login';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Register from './pages/Auth/Register';
import ResetPassword from './pages/Auth/ResetPassword';
import DocumentList from './pages/Documents/DocumentList';

// Componentes
import Navbar from './components/Navbar';
import './App.css';

// Layout que envuelve rutas privadas
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <>
      <Navbar
        isAuthenticated={!!user}
        isAdmin={user?.role === 'admin'}
        onLogout={logout}
      />
      <main className="main-content">
        {children}
      </main>
    </>
  );
};

// Componente para proteger rutas privadas
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas Privadas */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout>
                  <DocumentList />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/documents"
            element={
              <PrivateRoute>
                <Layout>
                  <DocumentList />
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
