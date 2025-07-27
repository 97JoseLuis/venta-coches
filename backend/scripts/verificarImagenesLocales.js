const mongoose = require('mongoose');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const Coche = require('../models/coche');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(' Conectado a MongoDB');

    const coches = await Coche.find();
    const locales = coches.filter(c => c.imagen && !c.imagen.startsWith('http'));

    if (locales.length === 0) {
      console.log(' Todos los coches tienen imágenes de Cloudinary o URLs absolutas.');
    } else {
      console.log(` Coches con imágenes locales (${locales.length}):`);
      locales.forEach(c => {
        console.log(`- ${c._id}: ${c.marca} ${c.modelo} → ${c.imagen}`);
      });
    }

    process.exit();
  } catch (error) {
    console.error(' Error al verificar:', error.message);
    process.exit(1);
  }
})();
