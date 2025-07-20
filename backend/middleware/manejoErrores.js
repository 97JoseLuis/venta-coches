// Manejo de rutas no encontradas (404)
const rutaNoEncontrada = (req, res, next) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
};

// Manejo de errores generales (500)
const errorServidor = (err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    mensaje: 'Ha ocurrido un error en el servidor',
    detalle: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};

module.exports = {
  rutaNoEncontrada,
  errorServidor,
};
