import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const AdminPanel = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [coches, setCoches] = useState([]);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario'));

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  return (
    <div className="admin-panel">
      <h2>Panel de Administración</h2>

      {error && <p className="error">{error}</p>}

      {!error && (
        <>
          <section>
            <h3>Usuarios registrados</h3>
            <table>
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
                    <td>{usuario.nombre}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.rol || 'usuario'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section>
            <h3>Coches publicados</h3>
            <ul>
              {coches.map((coche) => (
                <li key={coche._id}>
                  <strong>{coche.marca}</strong> {coche.modelo} - {coche.precio} €
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
};

export default AdminPanel;
