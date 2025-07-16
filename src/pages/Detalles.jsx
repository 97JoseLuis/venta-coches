import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCocheById } from '../services/cocheService';

const Detalles = () => {
  const { id } = useParams();
  const [coche, setCoche] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarCoche = async () => {
      try {
        const data = await getCocheById(id);
        setCoche(data);
      } catch (err) {
        setError('No se pudo cargar el coche');
      }
    };
    cargarCoche();
  }, [id]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!coche) return <p>Cargando...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{coche.marca} {coche.modelo}</h1>
      {coche.imagen && (
        <img
          src={coche.imagen}
          alt={`${coche.marca} ${coche.modelo}`}
          style={{ maxWidth: '400px', borderRadius: '8px', marginBottom: '1rem' }}
        />
      )}
      <p><strong>Año:</strong> {coche.año}</p>
      <p><strong>Precio:</strong> {coche.precio} €</p>
      <p><strong>Descripción:</strong> {coche.descripcion}</p>
    </div>
  );
};

export default Detalles;
