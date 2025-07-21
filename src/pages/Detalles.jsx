import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCocheById, actualizarEstadoCoche } from '../services/cocheService';

const Detalles = () => {
  const { id } = useParams();
  const [coche, setCoche] = useState(null);
  const [error, setError] = useState('');
  const [usuario, setUsuario] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const cargarCoche = async () => {
      try {
        const data = await getCocheById(id);
        setCoche(data);
      } catch (err) {
        setError('Error al cargar el coche');
      }
    };

    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }

    cargarCoche();
  }, [id]);

  const esDueño = usuario && coche && usuario._id === coche.userId._id;

  const cambiarEstado = async (nuevoEstado) => {
    try {
      const actualizado = await actualizarEstadoCoche(id, nuevoEstado, token);
      setCoche(actualizado); // actualiza el estado en la vista
    } catch (err) {
      console.error('Error al actualizar estado:', err);
    }
  };

  if (error) return <p>{error}</p>;
  if (!coche) return <p>Cargando...</p>;

  return (
    <div className="detalles-container">
      <h2>{coche.marca} {coche.modelo}</h2>
      
      <div className="detalle-imagen">
        {/* Imagen del coche */}
        <img
          src={import.meta.env.VITE_API_URL + coche.imagen}
          alt={coche.marca + ' ' + coche.modelo}
          className={`imagen-coche${coche.estado !== 'disponible' ? ' opaca' : ''}`}
        />

        {/* Cartel de estado sobre la imagen */}
        {coche.estado !== 'disponible' && (
          <div className={`estado-banner ${coche.estado}`}>
            {coche.estado.toUpperCase()}
          </div>
        )}
      </div>

      <p><strong>Año:</strong> {coche.anio}</p>
      <p><strong>Precio:</strong> {coche.precio} €</p>
      <p><strong>Descripción:</strong> {coche.descripcion}</p>

      {/* Botones para el dueño del anuncio */}
      {esDueño && (
        <div className="estado-botones">
          <p><strong>Cambiar estado:</strong></p>
          <button onClick={() => cambiarEstado('disponible')}>Disponible</button>
          <button onClick={() => cambiarEstado('reservado')}>Reservado</button>
          <button onClick={() => cambiarEstado('vendido')}>Vendido</button>
        </div>
      )}

      {/* Botón de contacto para los demás usuarios */}
      {!esDueño && (
        <div className="contacto-anunciante">
          <h3>Contactar con el anunciante</h3>
          <p><strong>Nombre:</strong> {coche.userId?.nombre}</p>
          <p><strong>Email:</strong> {coche.userId?.email}</p>
        </div>
      )}
    </div>
  );
};

export default Detalles;