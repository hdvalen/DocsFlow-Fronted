import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Bienvenido {user?.name}</h1>
      <p className="mt-2">Rol: {user?.role}</p>
      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 mt-4 rounded"
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Dashboard;
