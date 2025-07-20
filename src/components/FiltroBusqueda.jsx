import React, { useEffect, useState } from 'react';
import { getOpcionesFiltro } from '../services/cocheService';

/**
 * Componente de filtro de búsqueda por marca y modelo
 * Recibe una función onBuscar para pasar los filtros al padre
 */
const FiltroBusqueda = ({ onBuscar }) => {
  const [marcaSeleccionada, setMarcaSeleccionada] = useState('');
  const [modeloSeleccionado, setModeloSeleccionado] = useState('');
  const [opciones, setOpciones] = useState({}); // { marca1: [modelo1, modelo2], ... }

  // Obtener las opciones al cargar el componente
  useEffect(() => {
    const cargarOpciones = async () => {
      const data = await getOpcionesFiltro();
      setOpciones(data);
    };
    cargarOpciones();
  }, []);

  // Enviar filtros al padre
  const handleBuscar = (e) => {
    e.preventDefault();
    onBuscar({ marca: marcaSeleccionada, modelo: modeloSeleccionado });
  };

  return (
    <form onSubmit={handleBuscar} className="search-card">
      <h2>Buscar coche</h2>

      {/* Marca */}
      <select
        value={marcaSeleccionada}
        onChange={(e) => {
          setMarcaSeleccionada(e.target.value);
          setModeloSeleccionado(''); // reiniciar modelo
        }}
      >
        <option value="">Selecciona una marca</option>
        {Object.keys(opciones).map((marca) => (
          <option key={marca} value={marca}>{marca}</option>
        ))}
      </select>

      {/* Modelo (se filtra según la marca) */}
      <select
        value={modeloSeleccionado}
        onChange={(e) => setModeloSeleccionado(e.target.value)}
        disabled={!marcaSeleccionada}
      >
        <option value="">Selecciona un modelo</option>
        {(opciones[marcaSeleccionada] || []).map((modelo) => (
          <option key={modelo} value={modelo}>{modelo}</option>
        ))}
      </select>

      <button type="submit">Buscar</button>
    </form>
  );
};

export default FiltroBusqueda;