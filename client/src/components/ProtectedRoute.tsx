import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext/AuthState.js";

export default function ProtectedRoute() {
  const auth = useContext(AuthContext);

  if (!auth) {
    return <div>Loading...</div>;
  }

  return auth.token ? <Outlet /> : <Navigate to="/login" replace />;
}