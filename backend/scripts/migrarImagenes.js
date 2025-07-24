require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const { cloudinary } = require('../config/cloudinary');
const Coche = require('../models/coche');

(async () => {
  try {
    if (!process.env.CLOUDINARY_API_KEY) {
      throw new Error('Faltan variables de entorno de Cloudinary');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a MongoDB');

    const coches = await Coche.find();
    const cochesLocales = coches.filter(c => c.imagen && !c.imagen.startsWith('http'));

    console.log(`Coches con imágenes locales: ${cochesLocales.length}`);

    for (const coche of cochesLocales) {
      const rutaLocal = path.join(__dirname, '..', coche.imagen);

      if (!fs.existsSync(rutaLocal)) {
        console.warn(`Imagen no encontrada: ${rutaLocal}`);
        continue;
      }

      try {
        const result = await cloudinary.uploader.upload(rutaLocal, {
          folder: 'autoclick_uploads',
        });

        coche.imagen = result.secure_url;
        await coche.save();

        console.log(`Migrado: ${coche.marca} ${coche.modelo} → ${result.secure_url}`);
      } catch (err) {
        console.error(`Fallo al subir imagen de ${coche.marca} ${coche.modelo}:`, err.message);
      }
    }

    console.log('Migración completada.');
    process.exit(0);
  } catch (error) {
    console.error('Error en la migración:', error.message);
    process.exit(1);
  }
})();
