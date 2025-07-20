import React, { useState, useEffect } from 'react';

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);
  const [mostrarConfig, setMostrarConfig] = useState(false);

  useEffect(() => {
    const aceptadas = localStorage.getItem('cookies_aceptadas');
    if (!aceptadas) setVisible(true);
  }, []);

  const aceptarTodas = () => {
    localStorage.setItem('cookies_aceptadas', 'todas');
    setVisible(false);
  };

  const aceptarNecesarias = () => {
    localStorage.setItem('cookies_aceptadas', 'necesarias');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner">
      {!mostrarConfig ? (
        <>
          <p>
            Utilizamos cookies para mejorar tu experiencia. Al continuar navegando, aceptas nuestra{' '}
            <a href="/politica-cookies" target="_blank" rel="noopener noreferrer">Política de Cookies</a>.
          </p>
          <div className="cookie-buttons">
            <button onClick={aceptarTodas}>Aceptar todas</button>
            <button onClick={() => setMostrarConfig(true)}>Configurar</button>
          </div>
        </>
      ) : (
        <div className="configuracion-cookies">
          <p>Selecciona tus preferencias de cookies:</p>
          <ul>
            <li><strong>Cookies necesarias:</strong> esenciales para el funcionamiento del sitio (siempre activas)</li>
            <li><strong>Cookies analíticas:</strong> ayudan a mejorar la experiencia de usuario</li>
          </ul>
          <div className="cookie-buttons">
            <button onClick={aceptarTodas}>Aceptar todas</button>
            <button onClick={aceptarNecesarias}>Aceptar solo necesarias</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CookieBanner;
