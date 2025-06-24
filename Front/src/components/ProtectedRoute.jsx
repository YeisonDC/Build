// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // No hay token, redirige a login
    return <Navigate to="/login" replace />;
  }

  try {
    const { rol, exp } = jwtDecode(token);

    // Verificar si el token está expirado
    if (Date.now() >= exp * 1000) {
      localStorage.removeItem('token'); // Eliminar token expirado
      return <Navigate to="/login" replace />;
    }

    // Verificar si el rol está permitido
    if (!allowedRoles.includes(rol)) {
      return <Navigate to="/acceso-denegado" replace />;
    }

    // Si todo está bien, renderiza el componente hijo
    return <Outlet />;
  } catch (error) {
    // Token inválido o error al decodificar
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
