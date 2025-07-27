import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { crearCoche } from '../services/cocheService';

const VenderCoche = () => {
  const navigate = useNavigate();

  // Estado del formulario para crear un nuevo coche
  const [formulario, setFormulario] = useState({
    marca: '',
    modelo: '',
    anio: '',
    precio: '',
    descripcion: '',
    imagen: null,
  });

  // Maneja cambios en los inputs del formulario
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    // Si el campo es de tipo archivo, se guarda el archivo directamente
    if (name === 'imagen') {
      setFormulario({ ...formulario, imagen: files[0] });
    } else {
      setFormulario({ ...formulario, [name]: value });
    }
  };

  // Enviar el formulario para crear un coche
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Construir los datos a enviar como FormData
      const formData = new FormData();
      formData.append('marca', formulario.marca);
      formData.append('modelo', formulario.modelo);
      formData.append('anio', formulario.anio);
      formData.append('precio', formulario.precio);
      formData.append('descripcion', formulario.descripcion);
      if (formulario.imagen) {
        formData.append('imagen', formulario.imagen);
      }

      // Enviar datos al backend
      await crearCoche(formData);
      alert('Coche publicado correctamente');
      navigate('/'); // Redirigir al inicio tras crear el coche
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
        {/* Campo marca */}
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
        {/* Campo modelo */}
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
        {/* Campo año */}
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
        {/* Campo precio */}
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
        {/* Campo descripción */}
        <label>
          Descripción:
          <textarea
            name="descripcion"
            value={formulario.descripcion}
            onChange={handleChange}
            required
          />
        </label>
        {/* Campo imagen */}
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
