import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Detalles = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [coche, setCoche] = useState(null);
  const [mostrarContacto, setMostrarContacto] = useState(false);

  const esPropietario = user && coche?.usuario?._id === user._id;

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

  const cambiarEstado = async (nuevoEstado) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.patch(
        `${import.meta.env.VITE_API_URL}/coches/${id}/estado`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCoche({ ...coche, estado: data.estado });
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  if (!coche) return <p>Cargando...</p>;

  return (
    <div className="detalles-container">
      <h1>{coche.marca} {coche.modelo}</h1>

      <div className="detalle-imagen-container">
        <img src={coche.imagen} alt={`${coche.marca} ${coche.modelo}`} />

        {coche.estado !== 'disponible' && (
          <div className={`estado-etiqueta ${coche.estado}`}>
            {coche.estado}
          </div>
        )}
      </div>

      <p><strong>Precio:</strong> {coche.precio} €</p>
      <p><strong>Año:</strong> {coche.anio}</p>
      <p><strong>Descripción:</strong> {coche.descripcion}</p>

      <div className="detalles-acciones">
        {esPropietario && (
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
          </>
        )}
      </div>

      {!esPropietario && (
        <div className="contacto-anunciante">
          <button onClick={() => setMostrarContacto(!mostrarContacto)}>
            Contactar con el anunciante
          </button>

          {mostrarContacto && (
            <div className="info-contacto">
              <p><strong>Nombre:</strong> {coche.usuario?.nombre}</p>
              <p><strong>Email:</strong> {coche.usuario?.email}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Detalles;
