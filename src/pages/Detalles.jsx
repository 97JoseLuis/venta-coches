import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCocheById, eliminarCoche } from '../services/cocheService';

const Detalles = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coche, setCoche] = useState(null);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [mostrarContacto, setMostrarContacto] = useState(false);

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

  const handleEliminar = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este anuncio?')) return;
    try {
      await eliminarCoche(id, token);
      setMensaje('Anuncio eliminado correctamente');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError('Error al eliminar el anuncio');
    }
  };

  const esPropietario = usuario && coche && usuario.id === coche.userId?._id;

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!coche) return <p>Cargando...</p>;

  return (
    <div className="detalles-container">
      <h1>{coche.marca} {coche.modelo}</h1>
      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}

      {coche.imagen && (
        <img src={`http://localhost:5000${coche.imagen}`} alt={`${coche.marca} ${coche.modelo}`} />
      )}

      <p><strong>Año:</strong> {coche.anio}</p>
      <p><strong>Precio:</strong> {coche.precio} €</p>
      <p><strong>Descripción:</strong> {coche.descripcion}</p>

      {esPropietario && (
        <div className="detalles-acciones">
          <Link to={`/editar/${coche._id}`}>Editar anuncio</Link>
          <button onClick={handleEliminar}>Eliminar anuncio</button>
        </div>
      )}

      {/* Botón para mostrar contacto */}
      {coche.userId && (
        <div className="contacto-anunciante">
          <button onClick={() => setMostrarContacto(!mostrarContacto)}>
            {mostrarContacto ? 'Ocultar contacto' : 'Contactar con el anunciante'}
          </button>

          {mostrarContacto && (
            <div className="info-contacto">
              <p><strong>Nombre:</strong> {coche.userId.nombre}</p>
              <p><strong>Teléfono:</strong> {coche.userId.telefono}</p>
              <p><strong>Email:</strong> {coche.userId.email}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Detalles;