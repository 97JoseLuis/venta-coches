const express = require('express');
const router = express.Router();
const {
  registrarUsuario,
  loginUsuario,
  obtenerUsuarios
} = require('../controllers/usuarioController');

const verificarToken = require('../middleware/verificarToken');
const verificarAdmin = require('../middleware/verificarAdmin');

const { validarRegistro, validarLogin } = require('../middleware/validaciones');
const manejarErroresDeValidacion = require('../middleware/manejoValidaciones');

router.post('/registro', validarRegistro, manejarErroresDeValidacion, registrarUsuario);
router.post('/login', validarLogin, manejarErroresDeValidacion, loginUsuario);
router.get('/', verificarToken, verificarAdmin, obtenerUsuarios);

module.exports = router;
