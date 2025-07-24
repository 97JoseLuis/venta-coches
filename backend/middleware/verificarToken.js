const jwt = require('jsonwebtoken');

/**
 * Middleware de autenticación
 * Verifica si el token JWT es válido y adjunta el usuario a la petición
 */
const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verificamos si se proporcionó el token con el prefijo 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'Token no proporcionado o inválido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verificamos y decodificamos el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
};

module.exports = verificarToken;
