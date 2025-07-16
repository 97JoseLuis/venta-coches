import axios from 'axios';

const API_URL = 'http://localhost:5000/api/usuarios';

export const registrarUsuario = async (datos) => {
  const respuesta = await axios.post(`${API_URL}/registro`, datos);
  return respuesta.data;
};
