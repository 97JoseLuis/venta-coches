const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Definimos el esquema de usuario
const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // No se permiten emails duplicados
  },
  password: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    enum: ['usuario', 'admin'], // Solo se permite usuario o admin
    default: 'usuario',
  },
}, {
  timestamps: true, // Crea campos createdAt y updatedAt automáticamente
});

// Exportamos el modelo
module.exports = mongoose.model('Usuario', usuarioSchema);
