import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';

const API_URL = import.meta.env.VITE_API_URL;

const Register = () => {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'usuario',
    adminKey: '',
  });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nombre, email, password, rol, adminKey } = form;

    if (!nombre || !email || !password) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }

    try {
      // Registro
      await axios.post(`${API_URL}/api/usuarios/registro`, {
        nombre,
        email,
        password,
        rol,
        adminKey: rol === 'admin' ? adminKey : undefined,
      });

      // Login automático
      const res = await axios.post(`${API_URL}/api/usuarios/login`, {
        email,
        password,
      });

      login(res.data.token, res.data.usuario);
      setMensaje('Registro exitoso. Redirigiendo...');
      setError('');

      setTimeout(() => {
        navigate(res.data.usuario.rol === 'admin' ? '/admin' : '/');
      }, 1000);
    } catch (err) {
      const msg = err.response?.data?.mensaje || 'Error al registrar usuario';
      setError(msg);
      setMensaje('');
    }
  };

  return (
    <div className="register-container">
      <Helmet>
        <title>Registro | AutoClickCar</title>
        <meta name="description" content="Crea una cuenta para empezar a vender y comprar coches en AutoClickCar." />
      </Helmet>

      <h2>Crear cuenta en AutoClick</h2>
      {mensaje && <p className="mensaje success">{mensaje}</p>}
      {error && <p className="mensaje error">{error}</p>}

      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
        />

        <select name="rol" value={form.rol} onChange={handleChange}>
          <option value="usuario">Usuario</option>
          <option value="admin">Administrador</option>
        </select>

        {form.rol === 'admin' && (
          <input
            type="text"
            name="adminKey"
            placeholder="Clave secreta de administrador"
            value={form.adminKey}
            onChange={handleChange}
            required
          />
        )}

        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;
