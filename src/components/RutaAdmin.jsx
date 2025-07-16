import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * RutaAdmin
 * Protege rutas que solo deben ser accesibles por usuarios con rol admin
 */
const RutaAdmin = ({ children }) => {
  const usuarioJSON = localStorage.getItem('usuario');
  const usuario = usuarioJSON ? JSON.parse(usuarioJSON) : null;

  if (!usuario || usuario.rol !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

export default RutaAdmin;
