import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { crearCoche } from '../services/cocheService';

const VenderCoche = () => {
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    marca: '',
    modelo: '',
    anio: '',
    precio: '',
    descripcion: '',
    imagen: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imagen') {
      setFormulario({ ...formulario, imagen: files[0] });
    } else {
      setFormulario({ ...formulario, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('marca', formulario.marca);
      formData.append('modelo', formulario.modelo);
      formData.append('anio', formulario.anio);
      formData.append('precio', formulario.precio);
      formData.append('descripcion', formulario.descripcion);
      if (formulario.imagen) {
        formData.append('imagen', formulario.imagen);
      }

      await crearCoche(formData);
      alert('Coche publicado correctamente');
      navigate('/');
    } catch (error) {
      console.error('Error al crear coche:', error);
      alert('Error al crear el coche. Verifica que todos los campos estén bien.');
    }
  };

  return (
    <div className="vender-container">
      <Helmet>
        <title>Publicar coche - AutoClickCar</title>
        <meta
          name="description"
          content="Publica un nuevo coche de segunda mano en AutoClickCar. Rápido, fácil y seguro."
        />
      </Helmet>

      <h2>Publicar un nuevo coche</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Marca:
          <input
            type="text"
            name="marca"
            value={formulario.marca}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Modelo:
          <input
            type="text"
            name="modelo"
            value={formulario.modelo}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Año:
          <input
            type="number"
            name="anio"
            value={formulario.anio}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Precio (€):
          <input
            type="number"
            name="precio"
            value={formulario.precio}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Descripción:
          <textarea
            name="descripcion"
            value={formulario.descripcion}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Imagen:
          <input
            type="file"
            name="imagen"
            accept="image/*"
            onChange={handleChange}
          />
        </label>

        <button type="submit">Publicar anuncio</button>
      </form>
    </div>
  );
};

export default VenderCoche;
