const express = require('express');
const router = express.Router();
const multer = require('multer');
const Coche = require('../models/coche');
const verificarToken = require('../middleware/verificarToken');
const { validarCoche } = require('../middleware/validaciones');
const manejarErroresDeValidacion = require('../middleware/manejoValidaciones');

// Configuración de multer para imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Obtener marcas y modelos únicos para filtros
router.get('/filtros/opciones', async (req, res, next) => {
  try {
    const coches = await Coche.find({}, 'marca modelo'); // Solo marca y modelo

    const opciones = {};

    coches.forEach(c => {
      if (!opciones[c.marca]) {
        opciones[c.marca] = new Set();
      }
      opciones[c.marca].add(c.modelo);
    });

    // Convertimos los Sets a Arrays
    const resultado = {};
    for (const marca in opciones) {
      resultado[marca] = Array.from(opciones[marca]);
    }

    res.json(resultado);
  } catch (err) {
    next(err);
  }
});

// GET /api/coches
router.get('/', async (req, res, next) => {
  try {
    const coches = await Coche.find().populate('userId', 'nombre email'); // Poblamos el usuario
    res.json(coches);
  } catch (err) {
    next(err);
  }
});

// GET /api/coches/:id
router.get('/:id', async (req, res, next) => {
  try {
    const coche = await Coche.findById(req.params.id).populate('userId', 'nombre email telefono'); // Poblamos el usuario
    if (!coche) return res.status(404).json({ mensaje: 'Coche no encontrado' });
    res.json(coche);
  } catch (err) {
    next(err);
  }
});


// POST /api/coches
router.post(
  '/',
  verificarToken,
  upload.single('imagen'),
  validarCoche,
  manejarErroresDeValidacion,
  async (req, res, next) => {
    try {
      const { marca, modelo, anio, precio, descripcion } = req.body;
      const imagenUrl = req.file ? `/uploads/${req.file.filename}` : '';
      const coche = new Coche({
        marca,
        modelo,
        anio,
        precio,
        descripcion,
        imagen: imagenUrl,
        userId: req.usuario.id
      });
      const guardado = await coche.save();
      res.status(201).json(guardado);
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/coches/:id
router.put(
  '/:id',
  verificarToken,
  upload.single('imagen'),
  validarCoche,
  manejarErroresDeValidacion,
  async (req, res, next) => {
    try {
      console.log('Body recibido:', req.body);
      console.log('Archivo recibido:', req.file);

      const coche = await Coche.findById(req.params.id);
      if (!coche) return res.status(404).json({ mensaje: 'Coche no encontrado' });

      if (coche.userId.toString() !== req.usuario.id) {
        return res.status(403).json({ mensaje: 'No autorizado' });
      }

      coche.marca = req.body.marca;
      coche.modelo = req.body.modelo;
      coche.anio = parseInt(req.body.anio, 10);
      coche.precio = parseFloat(req.body.precio);
      coche.descripcion = req.body.descripcion;

      if (req.file) {
        coche.imagen = `/uploads/${req.file.filename}`;
      }

      const actualizado = await coche.save();
      res.json(actualizado);
    } catch (err) {
      console.error('Error al actualizar coche:', err);
      res.status(400).json({
        mensaje: 'Error al actualizar el coche',
        error: err.message,
        detalles: err.errors || null
      });
    }
  }
);


// DELETE /api/coches/:id
router.delete('/:id', verificarToken, async (req, res, next) => {
  try {
    const coche = await Coche.findById(req.params.id);
    if (!coche) return res.status(404).json({ mensaje: 'Coche no encontrado' });

    if (coche.userId.toString() !== req.usuario.id) {
      return res.status(403).json({ mensaje: 'No autorizado' });
    }

    await coche.deleteOne();
    res.json({ mensaje: 'Coche eliminado correctamente' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
