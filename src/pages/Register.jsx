import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';

const API_URL = import.meta.env.VITE_API_URL;

const Register = () => {
  // Estado del formulario de registro
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'usuario',     // Valor por defecto
    adminKey: '',       // Solo se usa si el rol es 'admin'
  });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Para iniciar sesión automáticamente tras el registro

  // Actualiza el estado del formulario al escribir
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nombre, email, password, rol, adminKey } = form;

    // Validación básica de campos requeridos
    if (!nombre || !email || !password) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }

    try {
      // Solicita el registro del nuevo usuario
      await axios.post(`${API_URL}/api/usuarios/registro`, {
        nombre,
        email,
        password,
        rol,
        adminKey: rol === 'admin' ? adminKey : undefined, // Solo enviar si es admin
      });

      // Inicia sesión automáticamente después del registro
      const res = await axios.post(`${API_URL}/api/usuarios/login`, {
        email,
        password,
      });

      login(res.data.token, res.data.usuario);
      setMensaje('Registro exitoso. Redirigiendo...');
      setError('');

      // Redirige según el rol del nuevo usuario
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
      {/* Mensajes de éxito o error */}
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
        {/* Selección del rol */}
        <select name="rol" value={form.rol} onChange={handleChange}>
          <option value="usuario">Usuario</option>
          <option value="admin">Administrador</option>
        </select>
        {/* Campo adicional para clave de admin, solo si se selecciona ese rol */}
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
