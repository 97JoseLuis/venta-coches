import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    navigate('/login');
  };

  const toggleMenu = () => setMenuAbierto(!menuAbierto);
  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" onClick={cerrarMenu}>AutoClickCar</Link>
      </div>

      <button className="navbar-toggle" onClick={toggleMenu} aria-label="Abrir menú">
        ☰
      </button>

      <ul className={`navbar-links ${menuAbierto ? 'abierto' : ''}`}>
        <li><Link to="/" onClick={cerrarMenu}>Inicio</Link></li>

        {usuario && <li><Link to="/vender" onClick={cerrarMenu}>Vender</Link></li>}
        {!usuario && <li><Link to="/login" onClick={cerrarMenu}>Login</Link></li>}
        {!usuario && <li><Link to="/registro" onClick={cerrarMenu}>Registro</Link></li>}

        {usuario?.rol === 'admin' && (
          <li><Link to="/admin" onClick={cerrarMenu}>Admin</Link></li>
        )}

        {usuario && (
          <li>
            <button
              className="logout-btn"
              onClick={() => {
                handleLogout();
                cerrarMenu();
              }}
              aria-label="Cerrar sesión"
            >
              Cerrar sesión
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
