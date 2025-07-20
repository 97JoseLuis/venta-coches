import React, { createContext, useState, useEffect } from 'react';

// Creamos el contexto de autenticación
export const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  // Al cargar la app, recuperamos el usuario desde localStorage
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, []);

  // Función para iniciar sesión
  const login = (usuario, token) => {
    setUsuario(usuario);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
  };

  // Función para cerrar sesión
  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
