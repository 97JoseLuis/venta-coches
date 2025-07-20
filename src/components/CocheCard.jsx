import React from 'react';
import { useNavigate } from 'react-router-dom';

const CocheCard = ({ coche, onEliminar }) => {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const esPropietario = usuario?.id === coche.userId?._id;

  return (
    <div className="card">
      <img src={coche.imagen} alt={coche.modelo} />
      <h3>{coche.marca} {coche.modelo}</h3>
      <p>{coche.descripcion}</p>
      <p><strong>Año:</strong> {coche.anio}</p>
      <p><strong>Precio:</strong> {coche.precio} €</p>

      {/* Mostrar quién lo publicó */}
      <p><strong>Publicado por:</strong> {coche.userId?.nombre || coche.userId?.email}</p>

      {/* Botones solo para el propietario */}
      {esPropietario && (
        <div>
          <button onClick={() => navigate(`/editar/${coche._id}`)}>Editar</button>
          <button onClick={() => onEliminar(coche._id)}>Eliminar</button>
        </div>
      )}
    </div>
  );
};

export default CocheCard;
