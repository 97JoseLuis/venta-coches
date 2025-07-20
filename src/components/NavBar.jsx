import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [menuAbierto, setMenuAbierto] = useState(false); // Estado para mostrar/ocultar el menú en móvil
  const usuario = JSON.parse(localStorage.getItem('usuario')); // Usuario logueado, si existe
  const navigate = useNavigate();

  // Cierra sesión del usuario
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  // Alterna el menú hamburguesa
  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  // Cierra el menú al hacer clic en un enlace
  const cerrarMenu = () => {
    setMenuAbierto(false);
  };

  return (
    <nav className="navbar">
      {/* Logo o título de la app */}
      <div className="navbar-logo">
        <Link to="/" onClick={cerrarMenu}>AutoClickCar</Link>
      </div>

      {/* Botón hamburguesa solo visible en pantallas pequeñas */}
      <button className="navbar-toggle" onClick={toggleMenu} aria-label="Abrir menú">
        ☰
      </button>


      {/* Enlaces de navegación */}
      <ul className={`navbar-links ${menuAbierto ? 'abierto' : ''}`}>
        <li><Link to="/" onClick={cerrarMenu}>Inicio</Link></li>

        {usuario && <li><Link to="/vender" onClick={cerrarMenu}>Vender</Link></li>}

        {!usuario && <li><Link to="/login" onClick={cerrarMenu}>Login</Link></li>}
        {!usuario && <li><Link to="/registro" onClick={cerrarMenu}>Registro</Link></li>}

        {usuario && usuario.rol === 'admin' && (
          <li><Link to="/admin" onClick={cerrarMenu}>Admin</Link></li>
        )}

        {/* Botón de cerrar sesión si está logueado */}
        {usuario && (
          <li>
            <button className="logout-btn" onClick={() => { handleLogout(); cerrarMenu(); }}>
              Cerrar sesión
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
