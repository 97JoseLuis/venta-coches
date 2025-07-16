import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * RutaPrivada
 * Comprueba si hay un token en localStorage. Si no, redirige al login.
 */
const RutaPrivada = ({ children }) => {
  const token = localStorage.getItem('token');

  return token ? children : <Navigate to="/login" />;
};

export default RutaPrivada;
