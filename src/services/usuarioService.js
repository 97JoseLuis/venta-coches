import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const loginUsuario = async (credenciales) => {
  try {
    const response = await axios.post(`${API_URL}/api/usuarios/login`, credenciales);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.mensaje || 'Error en login');
  }
};

export const registrarUsuario = async (datos) => {
  try {
    const response = await axios.post(`${API_URL}/api/usuarios/registro`, datos);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.mensaje || 'Error al registrar');
  }
};