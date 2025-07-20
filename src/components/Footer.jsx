// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-contenido">
        <p>&copy; {new Date().getFullYear()} AutoClickCar. Todos los derechos reservados.</p>
        <p>
          <Link to="/politica-cookies">Política de cookies</Link> | 
          <a href="mailto:soporte@autoclickcar.com"> Contacto</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
