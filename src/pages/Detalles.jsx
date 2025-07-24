import React, { useEffect, useState, useContext, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Detalles = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario: user } = useContext(AuthContext);

  const [coche, setCoche] = useState(null);
  const [mostrarContacto, setMostrarContacto] = useState(false);

  const esPropietario = useMemo(() => {
    if (!user || !coche?.userId) return false;

    const cocheId = String(coche.userId._id || coche.userId);
    const usuarioId = String(user._id || user.id);

    return cocheId === usuarioId;
  }, [user, coche]);

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

  if (!coche) return <p>Cargando...</p>;

  return (
    <div className="detalles-container">
      <h1>{coche.marca} {coche.modelo}</h1>

      <div className="detalle-imagen-container">
        <img
          src={
            coche.imagen?.startsWith('http')
              ? coche.imagen
              : `${import.meta.env.VITE_API_URL}${coche.imagen}`
          }
          alt={`${coche.marca} ${coche.modelo}`}
        />

        {coche.estado !== 'disponible' && (
          <div className={`estado-etiqueta ${coche.estado}`}>
            {coche.estado}
          </div>
        )}
      </div>

      <p><strong>Precio:</strong> {new Intl.NumberFormat('es-ES', {
        style: 'currency', currency: 'EUR'
      }).format(coche.precio)}</p>

      <p><strong>Año:</strong> {coche.anio}</p>
      <p><strong>Descripción:</strong> {coche.descripcion}</p>

      {esPropietario && (
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

      {!esPropietario && (
        <div className="contacto-anunciante">
          <button onClick={() => setMostrarContacto(!mostrarContacto)}>
            Contactar con el anunciante
          </button>

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
