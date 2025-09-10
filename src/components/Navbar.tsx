import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

interface NavbarProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, isAdmin, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">DocsFlow</Link>
      </div>
      <ul className="navbar-links">
        {isAuthenticated ? (
          <>
            <li><Link to="/documents">Documentos</Link></li>
            {isAdmin && <li><Link to="/users">Usuarios</Link></li>} {/* Esta ruta aún no existe */}
            <li><button onClick={onLogout} className="logout-button">Cerrar Sesión</button></li>
          </>
        ) : (
          <li><Link to="/login">Iniciar Sesión</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;