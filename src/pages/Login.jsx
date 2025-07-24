import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError('Por favor, completa ambos campos.');
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/usuarios/login`, {
        email: form.email,
        password: form.password,
      });

      login(res.data.token, res.data.usuario);
      setMensaje('Inicio de sesión exitoso. Redirigiendo...');
      setError('');

      setTimeout(() => {
        if (res.data.usuario.rol === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 1000);
    } catch (err) {
      const msg = err.response?.data?.mensaje || 'Error al iniciar sesión';
      setError(msg);
      setMensaje('');
    }
  };

  return (
    <div className="login-container">
      <Helmet>
        <title>Iniciar sesión | AutoClickCar</title>
        <meta name="description" content="Inicia sesión para acceder a tu cuenta y administrar tus anuncios de coches." />
      </Helmet>

      <h2>Iniciar sesión</h2>

      {mensaje && <p className="mensaje success">{mensaje}</p>}
      {error && <p className="mensaje error">{error}</p>}

      <form className="login-form" onSubmit={handleSubmit}>
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
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;
