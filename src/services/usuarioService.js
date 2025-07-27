import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Inicia sesión con las credenciales del usuario
export const loginUsuario = async (credenciales) => {
  try {
    const response = await axios.post(`${API_URL}/api/usuarios/login`, credenciales);
    return response.data;
  } catch (error) {
    // Si el backend devuelve un mensaje de error, se usa ese
    throw new Error(error.response?.data?.mensaje || 'Error en login');
  }
};

// Registra un nuevo usuario con los datos proporcionados
export const registrarUsuario = async (datos) => {
  try {
    const response = await axios.post(`${API_URL}/api/usuarios/registro`, datos);
    return response.data;
  } catch (error) {
    // Lanza un error legible si algo falla durante el registro
    throw new Error(error.response?.data?.mensaje || 'Error al registrar');
  }
};
