import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL_USUARIOS;

export const loginUsuario = async (credenciales) => {
  const response = await axios.post(`${API_URL}/login`, credenciales);
  return response.data;
};

export const registrarUsuario = async (nuevoUsuario) => {
  const response = await axios.post(`${API_URL}/registro`, nuevoUsuario);
  return response.data;
};
