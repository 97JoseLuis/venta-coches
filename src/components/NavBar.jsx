import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  // Función para obtener el usuario desde localStorage
  const cargarUsuario = () => {
    const datosUsuario = localStorage.getItem('usuario');
    if (datosUsuario) {
      setUsuario(JSON.parse(datosUsuario));
    } else {
      setUsuario(null);
    }
  };

  // Cargar al montar y cuando cambia localStorage
  useEffect(() => {
    cargarUsuario();

    // Escuchar cambios de sesión desde otras pestañas (opcional)
    const handleStorageChange = () => cargarUsuario();
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Cerrar sesión
  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">AutoClickCar</Link>
      </div>

      <ul className="navbar-links">
        <li><Link to="/">Buscar</Link></li>

        {!usuario && (
          <>
            <li><Link to="/login">Acceder</Link></li>
            <li><Link to="/registro">Registrarse</Link></li>
          </>
        )}

        {usuario && (
          <>
            <li>
              <Link to="/vender">
                <button className="vender-btn">Vender</button>
              </Link>
            </li>
            <li>
              <span className="usuario-info">👤 {usuario.nombre} ({usuario.rol})</span>
            </li>
            <li>
              <button onClick={cerrarSesion} className="logout-btn">Cerrar sesión</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
