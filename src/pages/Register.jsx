import React, { useState } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre || !email || !password) {
      setMensaje('Por favor, completa todos los campos.');
      return;
    }

    // Simulación de registro exitoso (aquí iría la lógica real con fetch o axios)
    setMensaje('Registro exitoso. Redirigiendo...');
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  return (
    <div className="register-container">
      <h2>Crear cuenta en AutoClick</h2>
      {mensaje && <p className="mensaje">{mensaje}</p>}
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
