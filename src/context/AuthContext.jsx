import React, { createContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');

    if (token && usuarioGuardado) {
      try {
        const decodificado = jwtDecode(token);
        if (decodificado.exp * 1000 > Date.now()) {
          const parsed = JSON.parse(usuarioGuardado);
          const usuarioFinal = {
            ...parsed,
            _id: parsed._id || parsed.id, // Asegura _id esté disponible
          };
          setUsuario(usuarioFinal);
        } else {
          logout();
        }
      } catch (e) {
        logout();
      }
    }
  }, []);

  // Iniciar sesión (guardar en localStorage)
  const login = (token, usuario) => {
    const usuarioFinal = {
      ...usuario,
      _id: usuario._id || usuario.id, // Normaliza el ID
    };
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuarioFinal));
    setUsuario(usuarioFinal);
  };

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
