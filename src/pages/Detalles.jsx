import React, { useEffect, useState, useContext, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';

const Detalles = () => {
  const { id } = useParams(); // ID del coche desde la URL
  const navigate = useNavigate();
  const { usuario: user } = useContext(AuthContext); // Usuario actual desde contexto

  const [coche, setCoche] = useState(null); // Datos del coche
  const [mostrarContacto, setMostrarContacto] = useState(false); // Controla si se muestra info de contacto

  const esAdmin = user?.rol === 'admin'; // Verifica si el usuario es admin

  // Verifica si el usuario es el propietario del coche
  const esPropietario = useMemo(() => {
    if (!user || !coche?.userId) return false;

    const userId = String(user._id || user.id);
    const ownerId =
      typeof coche.userId === 'object'
        ? String(coche.userId._id || coche.userId.id)
        : String(coche.userId);

    return ownerId === userId;
  }, [user, coche]);

  // Carga los datos del coche al montar el componente o cambiar el ID
  useEffect(() => {
    const obtenerCoche = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/coches/${id}`
        );
        setCoche(data);
      } catch (error) {
        console.error('Error al obtener coche:', error);
        alert('No se pudo cargar el coche');
      }
    };

    obtenerCoche();
  }, [id]);

  // Cambia el estado del coche (disponible, reservado, vendido)
  const cambiarEstado = async (nuevoEstado) => {
    if (coche.estado === nuevoEstado) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Debes iniciar sesión para modificar el estado');
        return;
      }

      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/coches/${id}/estado`,
        { estado: nuevoEstado },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCoche({ ...coche, estado: data.estado });
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      alert(error.response?.data?.mensaje || 'No se pudo cambiar el estado');
    }
  };

  // Elimina el coche tras confirmación
  const handleEliminar = async () => {
    const confirmar = window.confirm('¿Estás seguro de que quieres eliminar este anuncio?');
    if (!confirmar) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/coches/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Coche eliminado correctamente');
      navigate('/');
    } catch (error) {
      console.error('Error al eliminar coche:', error);
      alert(error.response?.data?.mensaje || 'No se pudo eliminar el coche');
    }
  };

  if (!coche) return <p>Cargando...</p>; // Muestra mensaje mientras se cargan los datos

  return (
    <div className="detalles-container">
      <Helmet>
        <title>{`${coche.marca} ${coche.modelo} - AutoClickCar`}</title>
        <meta
          name="description"
          content={`Detalles del ${coche.marca} ${coche.modelo}, año ${coche.anio}, precio ${coche.precio} €`}
        />
      </Helmet>

      <h1>{coche.marca} {coche.modelo}</h1>

      <div className="detalle-imagen-container">
        <img
          src={coche.imagen}
          alt={`${coche.marca} ${coche.modelo}`}
        />

        {/* Etiqueta con el estado del coche si no está disponible */}
        {coche.estado !== 'disponible' && (
          <div className={`estado-etiqueta ${coche.estado}`}>
            {coche.estado}
          </div>
        )}
      </div>

      {/* Info del coche */}
      <p><strong>Precio:</strong> {new Intl.NumberFormat('es-ES', {
        style: 'currency', currency: 'EUR'
      }).format(coche.precio)}</p>

      <p><strong>Año:</strong> {coche.anio}</p>
      <p><strong>Descripción:</strong> {coche.descripcion}</p>

      {/* Opciones solo visibles para el propietario o admin */}
      {(esPropietario || esAdmin) && (
        <div className="detalles-acciones">
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
        </div>
      )}

      {/* Mostrar contacto solo si el usuario no es el dueño ni admin */}
      {!esPropietario && !esAdmin && (
        <div className="contacto-anunciante">
          <button onClick={() => setMostrarContacto(!mostrarContacto)}>
            Contactar con el anunciante
          </button>

          {/* Info de contacto si está habilitado y el usuario del coche es un objeto */}
          {mostrarContacto && coche.userId && typeof coche.userId === 'object' && (
            <div className="info-contacto">
              <p><strong>Nombre:</strong> {coche.userId.nombre}</p>
              <p><strong>Email:</strong> {coche.userId.email}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Detalles;
