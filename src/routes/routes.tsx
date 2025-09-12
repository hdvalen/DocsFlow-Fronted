import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Auth/Login"; 
import Dashboard from "../pages/Documents/DocumentList"; 
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react";

// Rutas privadas
const PrivateRoute = ({
  children,
  roles,
}: {
  children: JSX.Element;
  roles?: string[];
}) => {
  const { token, user } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user?.role || "")) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* públicas */}
        <Route path="/login" element={<Login />} />

        {/* privadas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute roles={["admin", "user"]}>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* página acceso denegado */}
        <Route path="/unauthorized" element={<h2>🚫 Acceso denegado</h2>} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
