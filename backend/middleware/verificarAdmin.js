const Usuario = require('../models/usuario');

const verificarAdmin = async (req, res, next) => {
  try {
    // Asegurarse de que req.usuario existe
    if (!req.usuario || !req.usuario.id) {
      return res.status(401).json({ mensaje: 'No autenticado' });
    }

    // Buscar al usuario en la base de datos
    const usuario = await Usuario.findById(req.usuario.id);

    // Verificar si es admin
    if (usuario && usuario.rol === 'admin') {
      return next();
    }

    return res.status(403).json({ mensaje: 'Acceso denegado: solo para administradores' });
  } catch (error) {
    console.error('Error en verificarAdmin:', error);
    return res.status(500).json({ mensaje: 'Error en la verificación de rol' });
  }
};

module.exports = verificarAdmin;
