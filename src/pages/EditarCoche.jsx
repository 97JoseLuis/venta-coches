import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCocheById, actualizarEstadoCoche } from '../services/cocheService';

const EditarCoche = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    marca: '',
    modelo: '',
    anio: '',
    precio: '',
    descripcion: '',
    imagen: null,
  });

  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(true);

  const usuario = (() => {
    try {
      return JSON.parse(localStorage.getItem('usuario'));
    } catch {
      return null;
    }
  })();

  const token = localStorage.getItem('token');

  useEffect(() => {
    const cargarCoche = async () => {
      try {
        const data = await getCocheById(id);

        const cocheUserId = data.userId?._id || data.userId;

        if (!usuario || String(usuario.id) !== String(cocheUserId)) {
          alert('No tienes permisos para editar este coche.');
          return navigate('/');
        }

        setFormulario({
          marca: data.marca ?? '',
          modelo: data.modelo ?? '',
          anio: data.anio?.toString() ?? '',
          precio: data.precio?.toString() ?? '',
          descripcion: data.descripcion ?? '',
          imagen: null,
        });

        setLoading(false);
      } catch (err) {
        alert('No se pudo cargar el coche');
        navigate('/');
      }
    };

    cargarCoche();
  }, [id]);

  const validar = () => {
    const erroresTemp = {};
    const anioActual = new Date().getFullYear();

    if (!formulario.marca.trim()) erroresTemp.marca = 'La marca es obligatoria';
    if (!formulario.modelo.trim()) erroresTemp.modelo = 'El modelo es obligatorio';
    if (!formulario.anio || formulario.anio < 1900 || formulario.anio > anioActual) {
      erroresTemp.anio = `El año debe estar entre 1900 y ${anioActual}`;
    }
    if (!formulario.precio || formulario.precio <= 0) {
      erroresTemp.precio = 'El precio debe ser mayor a 0';
    }
    if (!formulario.descripcion.trim()) erroresTemp.descripcion = 'La descripción es obligatoria';

    if (formulario.imagen) {
      const tipo = formulario.imagen.type;
      if (!['image/jpeg', 'image/png'].includes(tipo)) {
        erroresTemp.imagen = 'La imagen debe ser JPG o PNG';
      }
      if (formulario.imagen.size > 5 * 1024 * 1024) {
        erroresTemp.imagen = 'La imagen no debe superar los 5 MB';
      }
    }

    setErrores(erroresTemp);
    return Object.keys(erroresTemp).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (name === 'imagen') {
      setFormulario({ ...formulario, imagen: files[0] });
    } else {
      const nuevoValor = type === 'number' ? value : value;
      setFormulario({ ...formulario, [name]: nuevoValor });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) {
      alert('Por favor, corrige los errores en el formulario antes de continuar.');
      return;
    }

    try {
      await actualizarEstadoCoche(id, formulario, token);
      navigate(`/detalles/${id}`);
    } catch (error) {
      alert('Error al actualizar el coche');
      console.error('Detalles del error:', error);
    }
  };

  if (loading) return <p>Cargando datos del coche...</p>;

  return (
    <div className="editar-coche-container">
      <h2>Editar coche</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>
          Marca:
          <input type="text" name="marca" value={formulario.marca} onChange={handleChange} />
          {errores.marca && <span className="error">{errores.marca}</span>}
        </label>

        <label>
          Modelo:
          <input type="text" name="modelo" value={formulario.modelo} onChange={handleChange} />
          {errores.modelo && <span className="error">{errores.modelo}</span>}
        </label>

        <label>
          Año:
          <input type="number" name="anio" value={formulario.anio} onChange={handleChange} />
          {errores.anio && <span className="error">{errores.anio}</span>}
        </label>

        <label>
          Precio (€):
          <input type="number" name="precio" value={formulario.precio} onChange={handleChange} />
          {errores.precio && <span className="error">{errores.precio}</span>}
        </label>

        <label>
          Descripción:
          <textarea name="descripcion" value={formulario.descripcion} onChange={handleChange} />
          {errores.descripcion && <span className="error">{errores.descripcion}</span>}
        </label>

        <label>
          Nueva imagen (opcional):
          <input type="file" name="imagen" accept="image/*" onChange={handleChange} />
          {errores.imagen && <span className="error">{errores.imagen}</span>}
        </label>

        <button type="submit">Guardar cambios</button>
      </form>
    </div>
  );
};

export default EditarCoche;