import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./auth/AuthProvider";
import {Login} from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const { user } = useAuthContext();

  return (
    <Routes>
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/dashboard/*"
        element={user ? <Dashboard /> : <Navigate to="/login" replace />}
      />
      <Route
        path="*"
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
      />
    </Routes>
  );
}

export default App;
