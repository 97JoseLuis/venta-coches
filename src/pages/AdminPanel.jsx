import React, { useEffect, useState } from 'react';
import axios from 'axios';

// URL del backend definida desde el entorno (.env)
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Panel de administración para usuarios con rol admin
 * Permite visualizar usuarios y coches registrados
 */
const AdminPanel = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [coches, setCoches] = useState([]);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      cargarUsuarios();
      cargarCoches();
    } else {
      setError('Acceso denegado. No autorizado.');
    }
  }, []);

  // Cargar lista de usuarios si el token es válido
  const cargarUsuarios = async () => {
    try {
      const res = await axios.get(`${API_URL}/usuarios`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsuarios(res.data);
    } catch (err) {
      setError('Error al cargar usuarios');
    }
  };

  // Cargar coches publicados
  const cargarCoches = async () => {
    try {
      const res = await axios.get(`${API_URL}/coches`);
      setCoches(res.data);
    } catch (err) {
      setError('Error al cargar coches');
    }
  };

  return (
    <div className="admin-panel">
      <h2>Panel de Administración</h2>

      {/* Mostrar errores si hay */}
      {error && <p className="error">{error}</p>}

      {!error && (
        <>
          {/* Sección de usuarios */}
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

          {/* Sección de coches */}
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