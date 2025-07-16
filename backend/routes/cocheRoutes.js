const express = require('express');
const router = express.Router();
const multer = require('multer');
const Coche = require('../models/coche');

// Configuración de almacenamiento con multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Carpeta donde se guardan las imágenes
  },
  filename: function (req, file, cb) {
    // Creamos un nombre único para evitar colisiones
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Ruta POST para crear un coche con imagen
router.post('/', upload.single('imagen'), async (req, res, next) => {
  try {
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);
    const { marca, modelo, anio, precio, descripcion } = req.body;
    let imagenUrl = '';

    // Si hay archivo, guardamos la ruta accesible para frontend
    if (req.file) {
      imagenUrl = `/uploads/${req.file.filename}`;
    }

    const nuevoCoche = new Coche({
      marca,
      modelo,
      anio,
      precio,
      descripcion,
      imagen: imagenUrl,
    });

    const cocheGuardado = await nuevoCoche.save();
    res.status(201).json(cocheGuardado);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
