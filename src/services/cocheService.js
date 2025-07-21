import axios from 'axios';
import coche from '../../backend/models/coche';

const API_URL = import.meta.env.VITE_API_URL;

// Obtener todos los coches
export const getCoches = async () => {
  const response = await fetch(`${API_URL}/coches`);
  const data = await response.json();
  return data;
};

// Obtener coche por ID
export const getCocheById = async (id) => {
  const response = await fetch(`${API_URL/coche}/${id}`);
  const data = await response.json();
  return data;
};

// Crear nuevo coche (con FormData e imagen)
export const crearCoche = async (nuevoCoche) => {
  const formData = new FormData();
  for (const key in nuevoCoche) {
    if (nuevoCoche[key]) {
      let valor = nuevoCoche[key];
      if (key === 'anio') valor = parseInt(valor);
      if (key === 'precio') valor = parseFloat(valor);
      formData.append(key, valor);
    }
  }

  const response = await axios.post(API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return response.data;
};

// Editar coche (por ID)
export const editarCoche = async (id, datosCoche) => {
  const formData = new FormData();
  for (const key in datosCoche) {
    let valor = datosCoche[key];
    if (
      valor !== null &&
      valor !== undefined &&
      valor !== ''
    ) {
      if (key === 'anio') valor = parseInt(valor);
      if (key === 'precio') valor = parseFloat(valor);
      formData.append(key, valor);
    }
  }

  const response = await axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return response.data;
};

// Eliminar coche
export const eliminarCoche = async (id, token) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Actualizar coche (con imagen opcional)
export const actualizarCoche = async (id, datosActualizados, token) => {
  try {
    const formData = new FormData();
    for (const key in datosActualizados) {
      let valor = datosActualizados[key];
      if (valor !== null && valor !== undefined && valor !== '') {
        if (key === 'anio') valor = parseInt(valor);
        if (key === 'precio') valor = parseFloat(valor);
        formData.append(key, valor);
      }
    }

    const response = await axios.put(`${API_URL}/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error al actualizar coche:', error.response?.data || error.message);
    throw error;
  }
};

// Obtener marcas y modelos para el filtro
export const getOpcionesFiltro = async () => {
  const response = await fetch(`${API_URL}/filtros/opciones`);
  const data = await response.json();
  return data;
};
