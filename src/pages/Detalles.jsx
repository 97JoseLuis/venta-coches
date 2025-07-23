import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Detalles = () => {
  // Obtenemos el ID del coche desde la URL y el usuario autenticado
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [coche, setCoche] = useState(null);              // Datos del coche
  const [mostrarContacto, setMostrarContacto] = useState(false);  // Toggle para mostrar contacto

  // Verificamos si el usuario actual es el dueño del coche (adaptado para cuando userId es string o objeto)
  const esPropietario = user && coche &&
    (coche.userId === user._id || coche.userId?._id === user._id);

  // Al cargar el componente, obtenemos los datos del coche desde la API
  useEffect(() => {
    const obtenerCoche = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/coches/${id}`);
        setCoche(data);
      } catch (error) {
        console.error('Error al obtener coche:', error);
      }
    };

    obtenerCoche();
  }, [id]);

  // Permite cambiar el estado del coche (disponible, reservado, vendido)
  const cambiarEstado = async (nuevoEstado) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/coches/${id}/estado`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCoche({ ...coche, estado: data.estado }); // Actualiza el estado local
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  // Eliminar anuncio
  const handleEliminar = async () => {
    const confirmar = window.confirm('¿Seguro que deseas eliminar este anuncio?');
    if (!confirmar) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/coches/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/');
    } catch (error) {
      console.error('Error al eliminar coche:', error);
      alert('No se pudo eliminar el anuncio.');
    }
  };

  // Si aún no se ha cargado el coche, mostramos mensaje de carga
  if (!coche) return <p>Cargando...</p>;

  return (
    <div className="detalles-container">
      {/* Título con marca y modelo */}
      <h1>{coche.marca} {coche.modelo}</h1>

      {/* Imagen del coche con etiqueta de estado si no está disponible */}
      <div className="detalle-imagen-container">
        <img
          src={`${import.meta.env.VITE_API_URL}${coche.imagen}`}
          alt={`${coche.marca} ${coche.modelo}`}
        />

        {coche.estado !== 'disponible' && (
          <div className={`estado-etiqueta ${coche.estado}`}>
            {coche.estado}
          </div>
        )}
      </div>

      {/* Información general del coche */}
      <div>
        <p><strong>Precio:</strong> {coche.precio} €</p>
        <p><strong>Año:</strong> {coche.anio}</p>
        <p><strong>Descripción:</strong> {coche.descripcion}</p>
      </div>

      {/* Acciones disponibles para el propietario (cambiar estado y editar) */}
      {esPropietario && (
        <div className="detalles-acciones">
          <>
            {coche.estado !== 'disponible' && (
              <button onClick={() => cambiarEstado('disponible')}>Disponible</button>
            )}
            {coche.estado !== 'reservado' && (
              <button onClick={() => cambiarEstado('reservado')}>Reservado</button>
            )}
            {coche.estado !== 'vendido' && (
              <button onClick={() => cambiarEstado('vendido')}>Vendido</button>
            )}
            <Link to={`/editar/${coche._id}`}>Editar</Link>
            <button onClick={handleEliminar}>Eliminar</button>
          </>
        </div>
      )}

      {/* Botón para contactar con el anunciante (solo visible si NO es el dueño) */}
      {!esPropietario && (
        <div className="contacto-anunciante">
          <button onClick={() => setMostrarContacto(!mostrarContacto)}>
            Contactar con el anunciante
          </button>

          {mostrarContacto && (
            <div className="info-contacto">
              <p><strong>Nombre:</strong> {coche.userId?.nombre}</p>
              <p><strong>Email:</strong> {coche.userId?.email}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Detalles;