const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**

Controlador para registrar un nuevo usuario
*/
const registrarUsuario = async (req, res) => {
try {
const { nombre, email, password, rol } = req.body;

// Validaciones básicas
if (!nombre || !email || !password) {
return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
}

const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailValido.test(email)) {
return res.status(400).json({ mensaje: 'Formato de email inválido' });
}

if (password.length < 6) {
return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 6 caracteres' });
}

// Verificar si el usuario ya existe
const usuarioExistente = await Usuario.findOne({ email });
if (usuarioExistente) {
return res.status(409).json({ mensaje: 'Ya existe un usuario con ese email' });
}

// Hashear la contraseña
const salt = await bcrypt.genSalt(10);
const passwordHasheada = await bcrypt.hash(password, salt);

// Crear nuevo usuario
const nuevoUsuario = new Usuario({
nombre,
email,
password: passwordHasheada,
rol: rol || 'usuario' // por defecto "usuario"
});

const usuarioGuardado = await nuevoUsuario.save();

// Crear token
const token = jwt.sign(
{ id: usuarioGuardado._id, nombre: usuarioGuardado.nombre, rol: usuarioGuardado.rol },
process.env.JWT_SECRET,
{ expiresIn: '3h' }
);

res.status(201).json({
mensaje: 'Usuario registrado correctamente',
token,
usuario: {
id: usuarioGuardado._id,
nombre: usuarioGuardado.nombre,
email: usuarioGuardado.email,
rol: usuarioGuardado.rol
}
});
} catch (error) {
console.error(error);
res.status(500).json({ mensaje: 'Error en el servidor al registrar usuario' });
}
};

/**

Controlador para login de usuario
*/
const loginUsuario = async (req, res) => {
  console.log('📩 Body recibido en login:', req.body);
try {
const { email, password } = req.body;

// Validaciones
if (!email || !password) {
return res.status(400).json({ mensaje: 'Email y contraseña son obligatorios' });
}

const usuario = await Usuario.findOne({ email });
if (!usuario) {
return res.status(401).json({ mensaje: 'Credenciales inválidas' });
}

const passwordValida = await bcrypt.compare(password, usuario.password);
if (!passwordValida) {
return res.status(401).json({ mensaje: 'Credenciales inválidas' });
}

// Generar token
const token = jwt.sign(
{ id: usuario._id, nombre: usuario.nombre, rol: usuario.rol },
process.env.JWT_SECRET,
{ expiresIn: '3h' }
);

res.status(200).json({
mensaje: 'Login exitoso',
token,
usuario: {
id: usuario._id,
nombre: usuario.nombre,
email: usuario.email,
rol: usuario.rol
}
});
} catch (error) {
console.error(error);
res.status(500).json({ mensaje: 'Error en el servidor al iniciar sesión' });
}
};

/**

Obtener todos los usuarios (solo admin)
*/
const obtenerUsuarios = async (req, res) => {
try {
const usuarios = await Usuario.find().select('-password'); // No mostrar contraseñas
res.json(usuarios);
} catch (error) {
console.error(error);
res.status(500).json({ mensaje: 'Error al obtener usuarios' });
}
};

module.exports = {
registrarUsuario,
loginUsuario,
obtenerUsuarios
};