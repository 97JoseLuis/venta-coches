const jwt = require('jsonwebtoken');

/**
 * Middleware de autenticación
 * Verifica si el token JWT es válido y adjunta el usuario a la petición
 */
const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'Token no proporcionado o inválido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({ mensaje: 'Token válido pero sin ID de usuario' });
    }

    req.usuario = decoded; // Incluye también el rol

    console.log('Usuario autenticado:', req.usuario); // Opcional
    next();
  } catch (error) {
    console.error('Error al verificar token:', error.message);
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
};

module.exports = verificarToken;
