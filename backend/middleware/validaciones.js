const { body } = require('express-validator');

// Validación para registrar usuario
const validarRegistro = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('email').isEmail().withMessage('Debe ser un email válido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
];

// Validación para login
const validarLogin = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
];

// Validación para coche (crear/editar)
const validarCoche = [
  body('marca')
    .trim()
    .notEmpty()
    .withMessage('La marca es obligatoria'),

  body('modelo')
    .trim()
    .notEmpty()
    .withMessage('El modelo es obligatorio'),

  body('anio')
    .notEmpty()
    .withMessage('El año es obligatorio')
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage(`El año debe estar entre 1900 y ${new Date().getFullYear()}`),

  body('precio')
    .notEmpty()
    .withMessage('El precio es obligatorio')
    .isFloat({ gt: 0 })
    .withMessage('El precio debe ser un número mayor a 0'),

  body('descripcion')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('La descripción no puede superar los 1000 caracteres'),
];

module.exports = {
  validarRegistro,
  validarLogin,
  validarCoche,
};
