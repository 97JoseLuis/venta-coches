import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Obtener todos los coches
export const getCoches = async () => {
  const response = await fetch(`${API_URL}/api/coches`);
  if (!response.ok)
    throw new Error('Error al obtener los coches');
  const data = await response.json();
  return data;
};

// Obtener coche por ID
export const getCocheById = async (id) => {
  const response = await fetch(`${API_URL}/api/coches/${id}`);
  if (!response.ok)
    throw new Error('Error al obtener el coche');
  const data = await response.json();
  return data;
};

// Crear nuevo coche (con FormData e imagen)
export const crearCoche = async (formulario) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No tienes token');

  const formData = new FormData();
  formData.append('marca', formulario.marca);
  formData.append('modelo', formulario.modelo);
  formData.append('anio', formulario.anio);
  formData.append('precio', formulario.precio);
  formData.append('descripcion', formulario.descripcion);

  if (formulario.imagen) {
    formData.append('imagen', formulario.imagen);
  }

  const response = await axios.post(`${API_URL}/api/coches`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
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

  const response = await axios.put(`${API_URL}/api/coches/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return response.data;
};

// Eliminar coche
export const eliminarCoche = async (id, token) => {
  const response = await axios.delete(`${API_URL}/api/coches/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Actualizar coche (con imagen opcional)
export const actualizarEstadoCoche = async (id, datosActualizados, token) => {
  try {
    if (!token) {
      throw new Error('Token de autorización no disponible.');
    }

    const formData = new FormData();
    for (const key in datosActualizados) {
      let valor = datosActualizados[key];
      if (valor !== null && valor !== undefined && valor !== '') {
        if (key === 'anio') {
          valor = parseInt(valor);
          if (isNaN(valor) || valor < 1900 || valor > new Date().getFullYear()) {
            throw new Error('El año debe ser un número válido entre 1900 y el año actual.');
          }
        }
        if (key === 'precio') {
          valor = parseFloat(valor);
          if (isNaN(valor) || valor <= 0) {
            throw new Error('El precio debe ser un número mayor a 0.');
          }
        }
        formData.append(key, valor);
      }
    }

    console.log('Datos enviados:', Object.fromEntries(formData.entries()));

    const response = await axios.put(`${API_URL}/api/coches/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      'Error al actualizar coche:',
      error.response?.status,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Obtener marcas y modelos para el filtro
export const getOpcionesFiltro = async () => {
  const response = await fetch(`${API_URL}/api/coches/filtros/opciones`);
  if (!response.ok)
    throw new Error('Error al obtener opciones de filtro');
  const data = await response.json();
  return data;
};