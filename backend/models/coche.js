const mongoose = require('mongoose');

// Definimos el esquema para un coche
const cocheSchema = new mongoose.Schema({
  marca: {
    type: String,
    required: true,  // La marca es obligatoria
  },
  modelo: {
    type: String,
    required: true,  // El modelo también es obligatorio
  },
  anio: {
    type: Number,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  descripcion: {
    type: String,
  },
  imagen: {
    type: String, // URL de la imagen del coche
  },
}, {
  timestamps: true, // Añade createdAt y updatedAt automáticamente
});

// Exportamos el modelo para usarlo en el controlador
module.exports = mongoose.model('Coche', cocheSchema);
