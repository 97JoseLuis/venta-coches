import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Detalles = () => {
  const { id } = useParams();                     // Obtenemos el ID del coche desde la URL
  const { user } = useContext(AuthContext);       // Obtenemos el usuario autenticado
  const navigate = useNavigate();                 // Para redirigir después de eliminar

  const [coche, setCoche] = useState(null);       // Estado del coche a mostrar
  const [mostrarContacto, setMostrarContacto] = useState(false); // Mostrar info del anunciante

  // Comprobamos si el usuario autenticado es el dueño del anuncio
  const esPropietario = user && coche?.usuario?._id === user._id;

  // Llamada a la API para obtener el coche al cargar
  useEffect(() => {
    const obtenerCoche = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/coches/${id}`);
        setCoche(data);
      } catch (error) {
        console.error('Error al obtener coche:', error);
      }
    };

    obtenerCoche();
  }, [id]);

  // Función para cambiar el estado del coche (reservado, vendido, disponible)
  const cambiarEstado = async (nuevoEstado) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/coches/${id}/estado`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCoche({ ...coche, estado: data.estado });
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  // Función para eliminar el coche
  const eliminarCoche = async () => {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar este anuncio?');
    if (!confirmacion) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/coches/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/'); // Redirigir al home
    } catch (error) {
      console.error('Error al eliminar coche:', error);
    }
  };

  if (!coche) return <p>Cargando...</p>;

  return (
    <div className="detalles-container">
      <h1>{coche.marca} {coche.modelo}</h1>

      {/* Imagen con cartel de estado si no está disponible */}
      <div className="detalle-imagen-container">
        <img src={coche.imagen} alt={`${coche.marca} ${coche.modelo}`} />
        {coche.estado !== 'disponible' && (
          <div className={`estado-etiqueta ${coche.estado}`}>
            {coche.estado}
          </div>
        )}
      </div>

      {/* Info básica del coche */}
      <p><strong>Precio:</strong> {coche.precio} €</p>
      <p><strong>Año:</strong> {coche.anio}</p>
      <p><strong>Descripción:</strong> {coche.descripcion}</p>

      {/* Acciones solo visibles para el propietario */}
      {esPropietario && (
        <div className="detalles-acciones">
          {/* Botones para cambiar estado */}
          {coche.estado !== 'disponible' && (
            <button onClick={() => cambiarEstado('disponible')}>Disponible</button>
          )}
          {coche.estado !== 'reservado' && (
            <button onClick={() => cambiarEstado('reservado')}>Reservado</button>
          )}
          {coche.estado !== 'vendido' && (
            <button onClick={() => cambiarEstado('vendido')}>Vendido</button>
          )}

          {/* Botón para editar el coche */}
          <Link to={`/editar/${coche._id}`}>Editar</Link>

          {/* Botón para eliminar */}
          <button onClick={eliminarCoche}>Eliminar</button>
        </div>
      )}

      {/* Sección de contacto visible solo si NO eres el dueño */}
      {!esPropietario && (
        <div className="contacto-anunciante">
          <button onClick={() => setMostrarContacto(!mostrarContacto)}>
            Contactar con el anunciante
          </button>

          {mostrarContacto && (
            <div className="info-contacto">
              <p><strong>Nombre:</strong> {coche.usuario?.nombre}</p>
              <p><strong>Email:</strong> {coche.usuario?.email}</p>
              {coche.usuario?.telefono && (
                <p><strong>Teléfono:</strong> {coche.usuario.telefono}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Detalles;