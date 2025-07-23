import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Detalles = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [coche, setCoche] = useState(null);
  const [mostrarContacto, setMostrarContacto] = useState(false);

  useEffect(() => {
    const obtenerCoche = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/coches/${id}`);
        setCoche(data);

        // Logs útiles para depuración
        console.log("Usuario logueado:", user);
        console.log("Propietario del coche:", data.userId);
        console.log(
          "¿Es propietario?:",
          user && data.userId && String(data.userId._id || data.userId) === String(user._id)
        );
      } catch (error) {
        console.error('Error al obtener coche:', error);
      }
    };

    obtenerCoche();
  }, [id, user]);

  const cambiarEstado = async (nuevoEstado) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/coches/${id}/estado`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCoche({ ...coche, estado: data.estado });
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  const eliminarCoche = async () => {
    const confirmacion = confirm('¿Estás seguro de que quieres eliminar este anuncio?');
    if (!confirmacion) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/coches/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/');
    } catch (error) {
      console.error('Error al eliminar coche:', error);
    }
  };

  // Asegura que funciona tanto si coche.userId es string o un objeto con _id
  const esPropietario =
    user &&
    coche?.userId &&
    String(typeof coche.userId === 'object' ? coche.userId._id : coche.userId) === String(user._id);

  if (!coche) return <p>Cargando...</p>;

  return (
    <div className="detalles-container">
      <h1>{coche.marca} {coche.modelo}</h1>

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

      <p><strong>Precio:</strong> {coche.precio} €</p>
      <p><strong>Año:</strong> {coche.anio}</p>
      <p><strong>Descripción:</strong> {coche.descripcion}</p>

      {esPropietario && (
        <div className="detalles-acciones">
          <div className="estado-botones">
            {coche.estado !== 'disponible' && (
              <button
                className="disponible-btn"
                onClick={() => cambiarEstado('disponible')}
              >
                Disponible
              </button>
            )}
            {coche.estado !== 'reservado' && (
              <button
                className="reservado-btn"
                onClick={() => cambiarEstado('reservado')}
              >
                Reservado
              </button>
            )}
            {coche.estado !== 'vendido' && (
              <button
                className="vendido-btn"
                onClick={() => cambiarEstado('vendido')}
              >
                Vendido
              </button>
            )}
          </div>
          <div>
            <Link to={`/editar/${coche._id}`}>Editar</Link>
            <button onClick={eliminarCoche}>Eliminar</button>
          </div>
        </div>
      )}

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