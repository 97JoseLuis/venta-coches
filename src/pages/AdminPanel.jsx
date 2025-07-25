import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const API_URL = import.meta.env.VITE_API_URL;

const AdminPanel = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [coches, setCoches] = useState([]);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !usuario || usuario.rol !== 'admin') {
      setError('Acceso denegado. No autorizado.');
      return;
    }

    cargarUsuarios();
    cargarCoches();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/usuarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(res.data);
    } catch (err) {
      setError('Error al cargar usuarios');
    }
  };

  const cargarCoches = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/coches`);
      setCoches(res.data);
    } catch (err) {
      setError('Error al cargar coches');
    }
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      const res = await axios.put(
        `${API_URL}/api/coches/${id}/estado`,
        { estado: nuevoEstado },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCoches((prev) =>
        prev.map((c) => (c._id === id ? { ...c, estado: res.data.estado } : c))
      );
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      alert('Error al cambiar el estado del coche');
    }
  };

  const eliminarCoche = async (id) => {
    const confirmar = window.confirm('¿Estás seguro de eliminar este coche?');
    if (!confirmar) return;

    try {
      await axios.delete(`${API_URL}/api/coches/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoches((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error('Error al eliminar coche:', err);
      alert('Error al eliminar el coche');
    }
  };

  return (
    <div className="admin-panel">
      <Helmet>
        <title>Panel de Administración - AutoClickCar</title>
        <meta
          name="description"
          content="Sección exclusiva para administradores donde puedes gestionar usuarios y coches publicados."
        />
      </Helmet>

      <h2>Panel de Administración</h2>

      {error && <p className="error">{error}</p>}

      {!error && (
        <>
          <section>
            <h3>Usuarios registrados</h3>
            <table className="tabla-usuarios">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario._id}>
                    <td data-label="Nombre">{usuario.nombre}</td>
                    <td data-label="Email">{usuario.email}</td>
                    <td data-label="Rol">{usuario.rol || 'usuario'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section>
            <h3>Coches publicados</h3>
            <div className="coches-admin-grid">
              {coches.map((coche) => (
                <div key={coche._id} className="coche-admin-card">
                  <p>
                    <strong>{coche.marca}</strong> {coche.modelo} - {coche.precio} €
                  </p>
                  <p>Estado: <strong>{coche.estado}</strong></p>

                  <div className="acciones-admin">
                    <button onClick={() => cambiarEstado(coche._id, 'disponible')}>Disponible</button>
                    <button onClick={() => cambiarEstado(coche._id, 'reservado')}>Reservado</button>
                    <button onClick={() => cambiarEstado(coche._id, 'vendido')}>Vendido</button>

                    <Link to={`/editar/${coche._id}`} className="editar-btn">Editar</Link>
                    <button onClick={() => eliminarCoche(coche._id)} className="eliminar-btn">Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default AdminPanel;
