import { useState, useEffect } from 'react';
import axios from 'axios';

// Obtenemos la URL base desde variables de entorno
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Hook personalizado para manejar la lógica relacionada con los coches
 */
export function useCoches() {
  const [coches, setCoches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Función para obtener la lista de coches desde el backend
   */
  const fetchCoches = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(`${API_URL}/coches`);
      setCoches(res.data);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al cargar coches');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Se ejecuta automáticamente al montar el componente
   */
  useEffect(() => {
    fetchCoches();
  }, []);

  /**
   * Elimina un coche por ID y actualiza la lista local
   * @param {string} id ID del coche a eliminar
   */
  const borrarCoche = async (id) => {
    try {
      await axios.delete(`${API_URL}/coches/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCoches((prev) => prev.filter((coche) => coche._id !== id));
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al borrar coche');
    }
  };

  /**
   * Agrega un nuevo coche (requiere objeto FormData)
   * @param {FormData} nuevoCoche datos del coche a registrar
   */
  const agregarCoche = async (nuevoCoche) => {
    try {
      const res = await axios.post(`${API_URL}/coches`, nuevoCoche, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCoches((prev) => [...prev, res.data]);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al añadir coche');
    }
  };

  return {
    coches,
    loading,
    error,
    fetchCoches,
    borrarCoche,
    agregarCoche,
  };
}