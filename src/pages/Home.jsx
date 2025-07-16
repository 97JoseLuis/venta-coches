import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

/**
 * Página de inicio de AutoClick
 * Muestra la portada y el listado de coches disponibles
 */
const Home = () => {
  const [coches, setCoches] = useState([]);
  const [error, setError] = useState(null);

  // Cargar coches al iniciar
  useEffect(() => {
    cargarCoches();
  }, []);

  // Función para obtener los coches desde la API
  const cargarCoches = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/coches');
      setCoches(res.data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar los coches');
    }
  };

  return (
    <div className="autoclick-home">
      {/* Cabecera */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>Encuentra el coche perfecto para ti</h1>
          <p>AutoClickCar te conecta con los mejores coches de segunda mano al mejor precio.</p>
        </div>
      </header>

      {/* Buscador */}
      <section className="search-section">
        <div className="search-card">
          <h2>Buscar coches</h2>
          <form>
            <select><option>Marca</option></select>
            <select><option>Modelo</option></select>
            <select><option>Precio máximo</option></select>
            <button type="submit">Buscar</button>
          </form>
        </div>
      </section>

      {/* Listado de coches */}
      <section className="coches-listado">
  <h2>Coches en venta</h2>
  {error && <p style={{ color: 'red' }}>{error}</p>}
  <div className="coches-grid-vertical">
    {coches.map((coche) => (
      <div key={coche._id} className="coche-tarjeta">
        <div className="coche-img-wrapper">
          <img
            src={`http://localhost:5000${coche.imagen}`}
            alt={`${coche.marca} ${coche.modelo}`}
          />
        </div>
        <div className="coche-detalles">
          <h3>{coche.marca} {coche.modelo}</h3>
          <p className="precio">{Number(coche.precio).toLocaleString()} €</p>
          <p className="info-secundaria">
            {coche.anio} · {coche.descripcion || 'Sin descripción'}
          </p>
          <Link to={`/detalles/${coche._id}`} className="ver-detalles-btn">Ver detalles</Link>
        </div>
      </div>
    ))}
  </div>
</section>

    </div>
  );
};

export default Home;
