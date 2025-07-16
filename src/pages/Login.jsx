import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook para redirigir
import axios from 'axios';
import './Login.css';

/**
 * Componente Login
 * Permite a los usuarios autenticarse enviando sus credenciales al backend
 */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate(); // Hook para navegación programada

  // Maneja el envío del formulario de login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Petición al backend para validar credenciales
      const response = await axios.post('http://localhost:5000/api/usuarios/login', {
        email,
        password
      });

      // Guardar token y usuario en localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario));

      setMensaje('Login exitoso');
      setError('');

      // Redirigir según el rol del usuario
      const { rol } = response.data.usuario;
      setTimeout(() => {
        if (rol === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.mensaje || 'Error al iniciar sesión');
      setMensaje('');
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>

      {/* Mensaje de éxito o error */}
      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Formulario de login */}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;
