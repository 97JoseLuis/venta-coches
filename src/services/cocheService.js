import axios from 'axios';

const API_URL = 'http://localhost:5000/api/coches';

export const getCoches = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const crearCoche = async (nuevoCoche) => {
  try {
    const response = await axios.post(API_URL, nuevoCoche);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// NUEVO: Obtener coche por ID
export const getCocheById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
