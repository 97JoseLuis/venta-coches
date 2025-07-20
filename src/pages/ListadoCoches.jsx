import React, { useEffect, useState } from 'react';
import { getCoches, eliminarCoche } from '../services/cocheService';
import CocheCard from '../components/CocheCard';

const ListadoCoches = () => {
  const [coches, setCoches] = useState([]);

  const cargarCoches = async () => {
    try {
      const data = await getCoches();
      setCoches(data);
    } catch (error) {
      console.error('Error cargando coches:', error);
    }
  };

  const handleEliminar = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await eliminarCoche(id, token);
      cargarCoches(); // refrescar la lista
    } catch (err) {
      alert('No se pudo eliminar el coche');
    }
  };

  useEffect(() => {
    cargarCoches();
  }, []);

  return (
    <div className="listado-coches">
      {coches.map((coche) => (
        <CocheCard key={coche._id} coche={coche} onEliminar={handleEliminar} />
      ))}
    </div>
  );
};

export default ListadoCoches;
