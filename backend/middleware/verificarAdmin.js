const Usuario = require('../models/usuario');

const verificarAdmin = async (req, res, next) => {
  const usuario = await Usuario.findById(req.usuario.id);
  if (usuario && usuario.rol === 'admin') {
    next();
  } else {
    return res.status(403).json({ mensaje: 'Acceso denegado: solo para administradores' });
  }
};

module.exports = verificarAdmin;
