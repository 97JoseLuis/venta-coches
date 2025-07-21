import React, { useState, useEffect } from 'react';
import { getCoches, getOpcionesFiltro } from '../services/cocheService';
import { Link } from 'react-router-dom';

const Home = () => {
  const [coches, setCoches] = useState([]);
  const [todosLosCoches, setTodosLosCoches] = useState([]);
  const [marcaFiltro, setMarcaFiltro] = useState('');
  const [modeloFiltro, setModeloFiltro] = useState('');
  const [opcionesFiltro, setOpcionesFiltro] = useState({});

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const cochesData = await getCoches();
        const opciones = await getOpcionesFiltro();
        setCoches(cochesData);
        setTodosLosCoches(cochesData);
        setOpcionesFiltro(opciones);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    cargarDatos();
  }, []);

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

  const handleReset = () => {
    setCoches(todosLosCoches);
    setMarcaFiltro('');
    setModeloFiltro('');
  };

  return (
    <div className="autoclick-home">
      {/* Sección con fondo de imagen */}
      <div className="hero-banner">
        <h1>Bienvenido a AutoClickCar</h1>
        <p>Tu plataforma para comprar y vender coches de segunda mano</p>
      </div>

      {/* Sección del video + buscador (se mantiene igual) */}
      <div className="hero-layout">
        <div className="video-hero">
          <video autoPlay muted loop playsInline>
            <source src="/entrega-llaves.mp4" type="video/mp4" />
            Tu navegador no soporta video HTML5.
          </video>
        </div>

        <div className="search-card">
          <h2>Filtrar coches</h2>
          <form onSubmit={handleBuscar}>
            <select
              value={marcaFiltro}
              onChange={(e) => {
                setMarcaFiltro(e.target.value);
                setModeloFiltro('');
              }}
            >
              <option value="">Marca</option>
              {Object.keys(opcionesFiltro).map((marca) => (
                <option key={marca} value={marca}>{marca}</option>
              ))}
            </select>

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

            <button type="submit" disabled={!marcaFiltro && !modeloFiltro}>
              Buscar
            </button>

            {(marcaFiltro || modeloFiltro) && (
              <button type="button" onClick={handleReset}>
                Ver todos
              </button>
            )}
          </form>
        </div>
      </div>

      {/*Listado de coches */}
      <div className="coches-listado">
        <h2>Coches disponibles</h2>
        <div className="coches-grid">
          {coches.map((coche) => (
            <div key={coche._id} className="coche-card">
              <img
                src={`${import.meta.env.VITE_API_URL}${coche.imagen}`}
                alt={`${coche.marca} ${coche.modelo}`}
              />
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