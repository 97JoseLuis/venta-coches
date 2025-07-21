import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCocheById } from '../services/cocheService';

const Detalles = () => {
  const { id } = useParams();
  const [coche, setCoche] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCoche = async () => {
      try {
        const data = await getCocheById(id);
        setCoche(data);
      } catch (err) {
        setError('Error al cargar los detalles del coche');
      }
    };

    fetchCoche();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!coche) return <p>Cargando...</p>;

  return (
    <div className="detalles-container">
      <h2>{coche.marca} {coche.modelo}</h2>

      {/* Imagen + cartel de estado */}
      <div className="detalle-imagen-container">
        <img
          src={`${import.meta.env.VITE_API_URL}${coche.imagen}`}
          alt={`${coche.marca} ${coche.modelo}`}
        />
        {coche.estado && coche.estado !== 'disponible' && (
          <span className={`estado-etiqueta ${coche.estado}`}>
            {coche.estado.toUpperCase()}
          </span>
        )}
      </div>

      <p><strong>Año:</strong> {coche.anio}</p>
      <p><strong>Precio:</strong> {coche.precio} €</p>
      <p><strong>Descripción:</strong> {coche.descripcion}</p>

      <div className="contacto-info">
        <p><strong>Contacto:</strong> {coche.userId?.nombre} ({coche.userId?.email})</p>
      </div>
    </div>
  );
};

export default Detalles;
