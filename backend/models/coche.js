const mongoose = require('mongoose');

const cocheSchema = new mongoose.Schema({
  marca: {
    type: String,
    required: [true, 'La marca es obligatoria'],
    trim: true,
    minlength: [2, 'La marca debe tener al menos 2 caracteres']
  },
  modelo: {
    type: String,
    required: [true, 'El modelo es obligatorio'],
    trim: true,
    minlength: [1, 'El modelo no puede estar vacío']
  },
  anio: {
    type: Number,
    required: [true, 'El año es obligatorio'],
    min: [1900, 'Año no válido'],
    max: [new Date().getFullYear() + 1, 'Año demasiado alto']
  },
  precio: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  descripcion: {
    type: String,
    maxlength: [1000, 'La descripción no puede superar los 1000 caracteres']
  },
  imagen: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Coche', cocheSchema);
