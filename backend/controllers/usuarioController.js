const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// REGISTRO de usuario
const registrarUsuario = async (req, res, next) => {
  try {
    const { nombre, email, password, rol, adminKey } = req.body;

    // Validar si ya existe
    const existente = await Usuario.findOne({ email });
    if (existente) return res.status(409).json({ mensaje: 'El usuario ya existe' });

    // Determinar rol: solo permitimos "admin" si la clave es correcta
    let rolFinal = 'usuario';
    if (rol === 'admin') {
      if (adminKey !== process.env.ADMIN_KEY) {
        return res.status(403).json({ mensaje: 'Clave de administrador incorrecta' });
      }
      rolFinal = 'admin';
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: hashedPassword,
      rol: rolFinal,
    });

    const guardado = await nuevoUsuario.save();
    res.status(201).json(guardado);
  } catch (err) {
    next(err);
  }
};

// LOGIN
const loginUsuario = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(401).json({ mensaje: 'Credenciales inválidas' });

    const match = await bcrypt.compare(password, usuario.password);
    if (!match) return res.status(401).json({ mensaje: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '3h' }
    );

    res.json({ token, usuario });
  } catch (err) {
    next(err);
  }
};

module.exports = { registrarUsuario, loginUsuario };
