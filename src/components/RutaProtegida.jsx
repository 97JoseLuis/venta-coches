import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

/**
 * RutaProtegida
 * Protege rutas privadas validando token y su expiración.
 */
const RutaProtegida = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token);
    const ahora = Date.now() / 1000;

    if (decoded.exp < ahora) {
      // Token expirado
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      return <Navigate to="/login" />;
    }

    return children;
  } catch (error) {
    // Token corrupto o inválido
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    return <Navigate to="/login" />;
  }
};

export default RutaProtegida;
