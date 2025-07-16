const mongoose = require('mongoose');

const cocheSchema = new mongoose.Schema({
  marca: { type: String, required: true },
  modelo: { type: String, required: true },
  anio: { type: Number, required: true },
  precio: { type: Number, required: true },
  descripcion: { type: String },
  imagen: { type: String },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Coche', cocheSchema);
