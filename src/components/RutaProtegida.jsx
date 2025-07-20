import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * RutaProtegida
 * Comprueba si hay un token en localStorage. Si no, redirige al login.
 */
const RutaProtegida = ({ children }) => {
  const token = localStorage.getItem('token');

  return token ? children : <Navigate to="/login" />;
};

export default RutaProtegida;
