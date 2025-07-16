import React, { useEffect, useState } from 'react';
import './Home.css';
import { getCoches } from '../services/cocheService';
import { Link } from 'react-router-dom';

/**
 * Página de inicio de AutoClick
 * Presenta portada, buscador y listado de coches en formato de tarjetas
 */
const Home = () => {
  const [coches, setCoches] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCoches();
        setCoches(data);
      } catch (err) {
        console.error('Error cargando coches:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="autoclick-home">
      {/* Cabecera principal */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>Encuentra el coche perfecto para ti</h1>
          <p>AutoClickCar te conecta con los mejores coches de segunda mano al mejor precio.</p>
        </div>
      </header>

      {/* Buscador (por ahora decorativo) */}
      <section className="search-section">
        <div className="search-card">
          <h2>Buscar coches</h2>
          <form>
            <select>
              <option>Marca</option>
            </select>
            <select>
              <option>Modelo</option>
            </select>
            <select>
              <option>Precio máximo</option>
            </select>
            <button type="submit">Buscar</button>
          </form>
        </div>
      </section>

      {/* Listado en tarjetas */}
      <section className="car-card-grid">
        {coches.map((coche) => (
          <div key={coche._id} className="car-card">
            {coche.imagen && (
              <img
                src={coche.imagen}
                alt={`${coche.marca} ${coche.modelo}`}
                className="car-card-img"
              />
            )}
            <div className="car-card-info">
              <h3>{coche.marca} {coche.modelo}</h3>
              <p><strong>Año:</strong> {coche.año}</p>
              <p><strong>Precio:</strong> {coche.precio} €</p>
              <p className="car-card-desc">{coche.descripcion?.slice(0, 100)}...</p>
              <Link to={`/detalles/${coche._id}`} className="car-card-button">
                Ver detalles
              </Link>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
