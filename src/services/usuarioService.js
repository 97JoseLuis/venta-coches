import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const loginUsuario = async (credenciales) => {
  const response = await fetch(`${API_URL}/usuarios/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credenciales),
  });

  if (!response.ok) throw new Error('Error en login');
  return await response.json();
};

export const registrarUsuario = async (datos) => {
  const response = await fetch(`${API_URL}/usuarios/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });

  if (!response.ok) throw new Error('Error al registrar');
  return await response.json();
};
