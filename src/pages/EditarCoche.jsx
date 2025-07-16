import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCocheById, actualizarCoche } from '../services/cocheService';
import { AuthContext } from '../context/AuthContext';

/**
 * Página de edición de un coche (solo para el dueño)
 */
const EditarCoche = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useContext(AuthContext);

  const [form, setForm] = useState({
    marca: '',
    modelo: '',
    anio: '',
    precio: '',
    descripcion: '',
    imagen: null
  });

  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const cargar = async () => {
      try {
        const coche = await getCocheById(id);

        if (usuario.id !== coche.userId) {
          setError('No estás autorizado para editar este coche');
          return;
        }

        setForm({
          marca: coche.marca,
          modelo: coche.modelo,
          anio: coche.anio,
          precio: coche.precio,
          descripcion: coche.descripcion,
          imagen: null
        });
      } catch (err) {
        setError('No se pudo cargar el coche');
      }
    };
    cargar();
  }, [id, usuario]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await actualizarCoche(id, form);
      setMensaje('Coche actualizado correctamente');
      setTimeout(() => navigate(`/detalles/${id}`), 1500);
    } catch (err) {
      console.error(err);
      setError('Error al actualizar el coche');
    }
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="editar-container">
      <h2>Editar Coche</h2>
      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="marca" value={form.marca} onChange={handleChange} required />
        <input type="text" name="modelo" value={form.modelo} onChange={handleChange} required />
        <input type="number" name="anio" value={form.anio} onChange={handleChange} required />
        <input type="number" name="precio" value={form.precio} onChange={handleChange} required />
        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} />
        <input type="file" name="imagen" accept="image/*" onChange={handleChange} />
        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default EditarCoche;
