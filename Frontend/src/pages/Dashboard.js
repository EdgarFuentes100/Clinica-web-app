import React from "react";
import { useAuthContext } from "../auth/AuthProvider";

const Dashboard = () => {
  const { user, logout } = useAuthContext();

  return (
    <div className="container mt-5">
      <h1>Bienvenido {user?.nombre || "Usuario"}</h1>
      <button className="btn btn-danger" onClick={logout}>Cerrar sesión</button>
    </div>
  );
};

export default Dashboard;
