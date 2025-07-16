import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCocheById, eliminarCoche } from '../services/cocheService';

/**
 * Página de detalles de un coche específico
 */
const Detalles = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [coche, setCoche] = useState(null);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState('');

  // Obtener el usuario autenticado del localStorage
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const token = localStorage.getItem('token');

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

  // Eliminar coche si es del usuario
  const handleEliminar = async () => {
    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este anuncio?');
    if (!confirmar) return;

    try {
      await eliminarCoche(id, token);
      setMensaje('Anuncio eliminado correctamente');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError('Error al eliminar el anuncio');
    }
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!coche) return <p>Cargando...</p>;

  // Verificar si el usuario logueado es dueño del coche
  const esPropietario = usuario && usuario.id === coche.userId;

  return (
    <div className="detalles-container">
      <h1>{coche.marca} {coche.modelo}</h1>

      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}

      {coche.imagen && (
        <img
          src={`http://localhost:5000${coche.imagen}`}
          alt={`${coche.marca} ${coche.modelo}`}
        />
      )}

      <p><strong>Año:</strong> {coche.anio}</p>
      <p><strong>Precio:</strong> {coche.precio} €</p>
      <p><strong>Descripción:</strong> {coche.descripcion}</p>

      {/* Botones de acción solo para el propietario */}
      {esPropietario && (
        <div className="detalles-acciones">
          <Link to={`/editar/${coche._id}`}>Editar anuncio</Link>
          <button onClick={handleEliminar}>Eliminar anuncio</button>
        </div>
      )}
    </div>
  );
};

export default Detalles;
