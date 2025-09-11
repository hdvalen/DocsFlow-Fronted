import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import "./Auth.css";
import BackgroundStars from "../../components/Background";

const Register: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [companyId, setCompanyId] = useState<string>(""); // relación con companies
  const [departmentId, setDepartmentId] = useState<string>(""); // relación con departments
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          company_id: Number(companyId),
          department_id: Number(departmentId),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error en el registro");
      }

      setSuccess("Registro exitoso. Ahora puedes iniciar sesión.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Error inesperado.");
      } else {
        setError("Error inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <BackgroundStars />

      <div className="auth-card">
        <h2>Registro</h2>
        <p className="subtitle">Crea tu cuenta en DocsFlow.</p>
        <form onSubmit={handleSubmit}>
          <Input
            label="Nombre completo"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Tu nombre"
          />
          <Input
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="correo@ejemplo.com"
          />
          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="********"
          />
          <Input
            label="Empresa (ID)"
            type="number"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            required
            placeholder="Ej: 1"
          />
          <Input
            label="Departamento (ID)"
            type="number"
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            required
            placeholder="Ej: 3"
          />

          {error && <p className="error-message auth-error">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
