const { validationResult } = require('express-validator');

const manejarErroresDeValidacion = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    // Convertir errores a un objeto tipo { campo: mensaje }
    const erroresFormateados = {};
    errores.array().forEach(err => {
      if (!erroresFormateados[err.param]) {
        erroresFormateados[err.param] = err.msg;
      }
    });

    return res.status(400).json({ errores: erroresFormateados });
  }

  next();
};

module.exports = manejarErroresDeValidacion;
