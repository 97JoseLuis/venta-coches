import React, { useState } from 'react';
import axios from 'axios';

/**
 * Página para que los usuarios publiquen un coche en venta
 */
const Vender = () => {
  const [form, setForm] = useState({
    marca: '',
    modelo: '',
    anio: '',
    precio: '',
    descripcion: '',
    imagen: null
  });

  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in form) {
      if (form[key]) formData.append(key, form[key]);
    }

    try {
      await axios.post('http://localhost:5000/api/coches', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMensaje('Coche publicado correctamente');
      setForm({
        marca: '',
        modelo: '',
        anio: '',
        precio: '',
        descripcion: '',
        imagen: null
      });
    } catch (error) {
      console.error(error);
      setMensaje('Error al publicar el coche');
    }
  };

  return (
    <div className="vender-container">
      <h2>Publicar un coche en venta</h2>
      {mensaje && <p>{mensaje}</p>}

      <form onSubmit={handleSubmit}>
        <input type="text" name="marca" placeholder="Marca" onChange={handleChange} value={form.marca} required />
        <input type="text" name="modelo" placeholder="Modelo" onChange={handleChange} value={form.modelo} required />
        <input type="number" name="anio" placeholder="Año" onChange={handleChange} value={form.anio} required />
        <input type="number" name="precio" placeholder="Precio (€)" onChange={handleChange} value={form.precio} required />
        <textarea name="descripcion" placeholder="Descripción" onChange={handleChange} value={form.descripcion}></textarea>
        <input type="file" name="imagen" accept="image/*" onChange={handleChange} />

        <button type="submit">Publicar</button>
      </form>
    </div>
  );
};

export default Vender;
