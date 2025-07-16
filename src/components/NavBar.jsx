import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './NavBar.css';

const NavBar = () => {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const cerrarSesion = () => {
    logout();
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
