const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');
const { validarRegistro, validarLogin } = require('../middleware/validaciones');
const manejarErroresDeValidacion = require('../middleware/manejoValidaciones');
const verificarToken = require('../middleware/verificarToken');
const verificarAdmin = require('../middleware/verificarAdmin');

// Registro de usuario
router.post('/registro', validarRegistro, manejarErroresDeValidacion, async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }

    const nuevoUsuario = new Usuario({ nombre, email, password });
    await nuevoUsuario.save();

    const token = jwt.sign(
      {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      usuario: {
        _id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
      },
    });
  } catch (error) {
    console.error('Error al registrar:', error);
    res.status(500).json({ mensaje: 'Error en el servidor al registrar' });
  }
});

// Login de usuario
router.post('/login', validarLogin, manejarErroresDeValidacion, async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas' });
    }

    const passwordValido = await usuario.compararPassword(password);
    if (!passwordValido) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      usuario: {
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      }
    });

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ mensaje: 'Error en el servidor al iniciar sesión' });
  }
});

// Obtener todos los usuarios (solo admin)
router.get('/', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password');
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ mensaje: 'Error en el servidor al obtener usuarios' });
  }
});

module.exports = router;
