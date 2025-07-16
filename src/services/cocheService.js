import axios from 'axios';

const API_URL = 'http://localhost:5000/api/coches';

// Obtener todos los coches
export const getCoches = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Obtener coche por ID
export const getCocheById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Crear nuevo coche (usando FormData)
export const crearCoche = async (nuevoCoche) => {
  try {
    const formData = new FormData();
    for (const key in nuevoCoche) {
      if (nuevoCoche[key]) {
        formData.append(key, nuevoCoche[key]);
      }
    }

    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Actualizar coche existente (usando FormData)
export const actualizarCoche = async (id, datosActualizados) => {
  try {
    const formData = new FormData();
    for (const key in datosActualizados) {
      if (datosActualizados[key]) {
        formData.append(key, datosActualizados[key]);
      }
    }

    const response = await axios.put(`${API_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Eliminar coche
export const eliminarCoche = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
