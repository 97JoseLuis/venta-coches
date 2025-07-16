import { useState, useEffect } from 'react';

// Hook para manejar coches desde API
export function useCoches() {
  const [coches, setCoches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para cargar coches
  const fetchCoches = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/coches');
      if (!res.ok) throw new Error('Error al cargar coches');
      const data = await res.json();
      setCoches(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar coches al montar el hook
  useEffect(() => {
    fetchCoches();
  }, []);

  // Borrar un coche por id
  const borrarCoche = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/coches/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al borrar coche');
      // Actualizamos la lista quitando el borrado
      setCoches((prev) => prev.filter(coche => coche._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Añadir un coche nuevo
  const agregarCoche = async (nuevoCoche) => {
    try {
      const res = await fetch('http://localhost:5000/api/coches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoCoche),
      });
      if (!res.ok) throw new Error('Error al añadir coche');
      const cocheCreado = await res.json();
      setCoches((prev) => [...prev, cocheCreado]);
    } catch (err) {
      setError(err.message);
    }
  };

  return { coches, loading, error, borrarCoche, agregarCoche };
}
