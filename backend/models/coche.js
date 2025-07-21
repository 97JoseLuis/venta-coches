const mongoose = require('mongoose');

const cocheSchema = new mongoose.Schema({
  marca: { type: String, required: true },
  modelo: { type: String, required: true },
  anio: { type: Number, required: true },
  precio: { type: Number, required: true },
  descripcion: { type: String, required: true },
  imagen: { type: String, default: '' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  estado: {
    type: String,
    enum: ['disponible', 'reservado', 'vendido'],
    default: 'disponible',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Coche', cocheSchema);
