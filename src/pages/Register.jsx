import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * Componente de registro de usuarios
 */
const Register = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    try {
      // Registrar usuario
      await axios.post('http://localhost:5000/api/usuarios/registro', {
        nombre, email, password,
      });

      // Iniciar sesión automáticamente
      const res = await axios.post('http://localhost:5000/api/usuarios/login', {
        email, password,
      });

      login(res.data.usuario, res.data.token);
      setMensaje('Registro exitoso. Redirigiendo...');
      setError('');

      // Redirigir según rol
      setTimeout(() => {
        if (res.data.usuario.rol === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al registrar');
      setMensaje('');
    }
  };

  return (
    <div className="register-container">
      <h2>Crear cuenta en AutoClick</h2>
      {mensaje && <p className="mensaje" style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p className="mensaje" style={{ color: 'red' }}>{error}</p>}

      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;
