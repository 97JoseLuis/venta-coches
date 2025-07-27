import React, { useState, useEffect } from 'react';
import { getCoches, getOpcionesFiltro } from '../services/cocheService';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const Home = () => {
  const [coches, setCoches] = useState([]); // Lista filtrada de coches
  const [todosLosCoches, setTodosLosCoches] = useState([]); // Lista completa de coches
  const [marcaFiltro, setMarcaFiltro] = useState(''); // Marca seleccionada en el filtro
  const [modeloFiltro, setModeloFiltro] = useState(''); // Modelo seleccionado en el filtro
  const [opcionesFiltro, setOpcionesFiltro] = useState({}); // Opciones de filtro agrupadas por marca

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Obtener todos los coches y las opciones de filtro disponibles
        const cochesData = await getCoches();
        const opciones = await getOpcionesFiltro();
        setCoches(cochesData);
        setTodosLosCoches(cochesData);
        setOpcionesFiltro(opciones);
      } catch (error) {
        console.error('Error cargando coches:', error);
      }
    };

    cargarDatos();
  }, []);

  // Maneja la búsqueda aplicando filtros de marca y modelo
  const handleBuscar = (e) => {
    e.preventDefault();
    const filtrados = todosLosCoches.filter((coche) => {
      return (
        (marcaFiltro === '' || coche.marca === marcaFiltro) &&
        (modeloFiltro === '' || coche.modelo === modeloFiltro)
      );
    });
    setCoches(filtrados);
  };

  // Resetea los filtros y muestra todos los coches
  const handleReset = () => {
    setCoches(todosLosCoches);
    setMarcaFiltro('');
    setModeloFiltro('');
  };

  return (
    <div className="autoclick-home">
      <Helmet>
        <title>Inicio | AutoClickCar</title>
        <meta name="description" content="Explora y filtra coches disponibles para comprar o vender en AutoClickCar." />
      </Helmet>
      <div className="hero-banner">
        <h1>Bienvenido a AutoClickCar</h1>
        <p>Tu plataforma para comprar y vender coches de segunda mano</p>
      </div>
      <div className="hero-layout">
        {/* Video de bienvenida */}
        <div className="video-hero">
          <video autoPlay muted loop playsInline>
            <source src="/entrega-llaves.mp4" type="video/mp4" />
            Tu navegador no soporta video HTML5.
          </video>
        </div>
        {/* Formulario de búsqueda */}
        <div className="search-card">
          <h2>Filtrar coches</h2>
          <form onSubmit={handleBuscar}>
            {/* Selector de marca */}
            <select
              value={marcaFiltro}
              onChange={(e) => {
                setMarcaFiltro(e.target.value);
                setModeloFiltro(''); // Reiniciar modelo cuando cambia la marca
              }}
            >
              <option value="">Marca</option>
              {Object.keys(opcionesFiltro).map((marca) => (
                <option key={marca} value={marca}>{marca}</option>
              ))}
            </select>
            {/* Selector de modelo (dependiente de la marca) */}
            <select
              value={modeloFiltro}
              onChange={(e) => setModeloFiltro(e.target.value)}
              disabled={!marcaFiltro}
            >
              <option value="">Modelo</option>
              {(opcionesFiltro[marcaFiltro] || []).map((modelo) => (
                <option key={modelo} value={modelo}>{modelo}</option>
              ))}
            </select>
            <button type="submit" disabled={!marcaFiltro && !modeloFiltro}>Buscar</button>
            {(marcaFiltro || modeloFiltro) && (
              <button type="button" onClick={handleReset}>Ver todos</button>
            )}
          </form>
        </div>
      </div>
      {/* Listado de coches */}
      <div className="coches-listado">
        <h2>Coches disponibles</h2>
        <div className="coches-grid">
          {coches.map((coche) => (
            <div key={coche._id} className="coche-card">
              <div className="imagen-container">
                <img
                  src={
                    coche.imagen?.startsWith('http')
                      ? coche.imagen
                      : `${import.meta.env.VITE_API_URL}${coche.imagen}`
                  }
                  alt={`${coche.marca} ${coche.modelo}`}
                />
                {/* Mostrar etiqueta de estado si el coche no está disponible */}
                {coche.estado && coche.estado !== 'disponible' && (
                  <span className={`estado-etiqueta ${coche.estado}`}>
                    {coche.estado.toUpperCase()}
                  </span>
                )}
              </div>
              <h3>{coche.marca} {coche.modelo}</h3>
              <p>{coche.anio} • {coche.precio} €</p>
              <Link className="detalles-btn" to={`/detalles/${coche._id}`}>
                Ver detalles
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
