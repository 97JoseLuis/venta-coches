import React from 'react';
import { Link } from 'react-router-dom';

const CocheCard = ({ coche }) => {
  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '1rem',
      width: '250px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)'
    }}>
      <img
        src={coche.imagen}
        alt={`${coche.marca} ${coche.modelo}`}
        style={{ width: '100%', borderRadius: '4px' }}
      />
      <h3>{coche.marca} {coche.modelo}</h3>
      <p>Año: {coche.anio}</p>
      <p>Precio: {coche.precio}€</p>
      {/* Botón que lleva a la vista de detalles */}
      <Link to={`/detalles/${coche.id}`}>Ver detalles</Link>
    </div>
  );
};

export default CocheCard;
