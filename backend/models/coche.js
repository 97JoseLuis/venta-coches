const mongoose = require('mongoose');

const cocheSchema = new mongoose.Schema({
  marca: {
    type: String,
    required: true,
    trim: true,
  },
  modelo: {
    type: String,
    required: true,
    trim: true,
  },
  anio: {
    type: Number,
    required: true,
    min: 1900,
  },
  precio: {
    type: Number,
    required: true,
    min: 0,
  },
  descripcion: {
    type: String,
    required: true,
    trim: true,
  },
  estado: {
    type: String,
    enum: ['disponible', 'reservado', 'vendido'],
    default: 'disponible',
  },
  imagen: {
    type: String, // Aquí se guarda la URL de Cloudinary
    default: '',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Coche', cocheSchema);
