const express = require('express');
const router = express.Router();
const {
  registrarUsuario,
  loginUsuario // Agregamos el controlador de login
} = require('../controllers/usuarioController');

// Ruta para registrar nuevo usuario
router.post('/registro', registrarUsuario);

// Ruta para iniciar sesión
router.post('/login', loginUsuario); // Esta línea es clave

module.exports = router;
