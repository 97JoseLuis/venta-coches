import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const [errores, setErrores] = useState({});

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
    }

    setErrores(erroresTemp);
    return Object.keys(erroresTemp).length === 0;
  };

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
  if (!validar()) return;

  try {
    const formData = new FormData();

    formData.append('marca', formulario.marca);
    formData.append('modelo', formulario.modelo);
    formData.append('anio', formulario.anio);
    formData.append('precio', formulario.precio);
    formData.append('descripcion', formulario.descripcion);
    if (formulario.imagen) formData.append('imagen', formulario.imagen);

    const user = JSON.parse(localStorage.getItem('usuario'));

    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
    
    // Usa axios o tu función crearCoche para hacer POST
    await crearCoche(formData); // asegúrate que acepta FormData

    navigate('/');
  } catch (error) {
    alert('Error al crear el coche');
    console.error(error);
  }
};

  return (
    <div className="vender-container">
      <h2>Publicar un nuevo coche</h2>
      <form onSubmit={handleSubmit}>
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
          Imagen (opcional):
          <input type="file" name="imagen" accept="image/*" onChange={handleChange} />
          {errores.imagen && <span className="error">{errores.imagen}</span>}
        </label>

        <button type="submit">Publicar anuncio</button>
      </form>
    </div>
  );
};

export default VenderCoche;
