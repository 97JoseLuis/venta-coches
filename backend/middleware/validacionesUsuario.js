const { body } = require('express-validator');

exports.validarRegistro = [
body('nombre')
.trim()
.notEmpty().withMessage('El nombre es obligatorio'),

body('email')
.trim()
.isEmail().withMessage('Email no válido'),

body('password')
.isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
];

exports.validarLogin = [
body('email')
.trim()
.isEmail().withMessage('Email no válido'),

body('password')
.notEmpty().withMessage('La contraseña es obligatoria'),
];