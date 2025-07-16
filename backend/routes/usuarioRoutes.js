const express = require('express');
const router = express.Router();
const {
  registrarUsuario,
  loginUsuario,
  obtenerUsuarios
} = require('../controllers/usuarioController');

const verificarToken = require('../middleware/verificarToken');
const verificarAdmin = require('../middleware/verificarAdmin');

router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario);

// Ruta protegida solo para ADMIN
router.get('/', verificarToken, verificarAdmin, obtenerUsuarios);

module.exports = router;
