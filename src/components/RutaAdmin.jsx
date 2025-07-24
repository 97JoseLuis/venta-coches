import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

/**
 * RutaAdmin
 * Solo permite acceso a usuarios con rol 'admin' y sesión activa.
 */
const RutaAdmin = ({ children }) => {
  const token = localStorage.getItem('token');
  const usuarioJSON = localStorage.getItem('usuario');

  if (!token || !usuarioJSON) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token);
    const ahora = Date.now() / 1000;

    if (decoded.exp < ahora) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      return <Navigate to="/login" />;
    }

    const usuario = JSON.parse(usuarioJSON);
    if (usuario.rol !== 'admin') return <Navigate to="/" />;

    return children;
  } catch (err) {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    return <Navigate to="/login" />;
  }
};

export default RutaAdmin;
