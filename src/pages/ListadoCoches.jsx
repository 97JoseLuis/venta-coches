import React, { useEffect, useState } from 'react';
import { getCoches, eliminarCoche } from '../services/cocheService';
import CocheCard from '../components/CocheCard';

const ListadoCoches = () => {
  const [coches, setCoches] = useState([]); // Lista de coches cargados

  // Carga los coches desde la API
  const cargarCoches = async () => {
    try {
      const data = await getCoches();
      setCoches(data);
    } catch (error) {
      console.error('Error cargando coches:', error);
    }
  };

  // Maneja la eliminación de un coche por ID
  const handleEliminar = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await eliminarCoche(id, token);
      cargarCoches(); // Recarga la lista después de eliminar
    } catch (err) {
      alert('No se pudo eliminar el coche');
    }
  };

  // Carga inicial de datos al montar el componente
  useEffect(() => {
    cargarCoches();
  }, []);

  return (
    <div className="listado-coches">
      {coches.length === 0 ? (
        <p>No hay coches disponibles en este momento.</p>
      ) : (
        // Renderiza una tarjeta por cada coche
        coches.map((coche) => (
          <CocheCard
            key={coche._id}
            coche={coche}
            onEliminar={handleEliminar}
          />
        ))
      )}
    </div>
  );
};

export default ListadoCoches;
