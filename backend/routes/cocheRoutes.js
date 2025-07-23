const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 📦 Modelos y Middlewares
const Coche = require('../models/coche');
const verificarToken = require('../middleware/verificarToken');
const { validarCoche } = require('../middleware/validaciones');
const manejarErroresDeValidacion = require('../middleware/manejoValidaciones');

// 📁 Configuración de almacenamiento de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + '-' + file.originalname);
  }
});
const upload = multer({ storage });


// ───────────────────────────────────────────────
// GET /api/coches/filtros/opciones
router.get('/filtros/opciones', async (req, res, next) => {
  try {
    const coches = await Coche.find({}, 'marca modelo');
    const opciones = {};

    coches.forEach((c) => {
      if (!opciones[c.marca]) opciones[c.marca] = new Set();
      opciones[c.marca].add(c.modelo);
    });

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
    const coches = await Coche.find().populate('userId', 'nombre email');
    res.json(coches);
  } catch (err) {
    next(err);
  }
});

// GET /api/coches/:id
router.get('/:id', async (req, res, next) => {
  try {
    const coche = await Coche.findById(req.params.id).populate('userId', 'nombre email');
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
      const imagenUrl = req.file
        ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
        : '';

      const nuevoCoche = new Coche({
        marca: req.body.marca,
        modelo: req.body.modelo,
        anio: req.body.anio,
        precio: req.body.precio,
        descripcion: req.body.descripcion,
        estado: 'disponible',
        imagen: imagenUrl,
        userId: req.usuario.id,
      });

      const cocheGuardado = await nuevoCoche.save();
      res.status(201).json(cocheGuardado);
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
      const coche = await Coche.findById(req.params.id);
      if (!coche) return res.status(404).json({ mensaje: 'Coche no encontrado' });

      if (String(coche.userId) !== req.usuario.id) {
        return res.status(403).json({ mensaje: 'No autorizado para editar este coche' });
      }

      coche.marca = req.body.marca || coche.marca;
      coche.modelo = req.body.modelo || coche.modelo;
      coche.anio = req.body.anio || coche.anio;
      coche.precio = req.body.precio || coche.precio;
      coche.descripcion = req.body.descripcion || coche.descripcion;

      if (req.file) {
        coche.imagen = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      }

      const cocheActualizado = await coche.save();
      res.json(cocheActualizado);
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/coches/:id/estado
router.put('/:id/estado', verificarToken, async (req, res, next) => {
  try {
    const coche = await Coche.findById(req.params.id);
    if (!coche) return res.status(404).json({ mensaje: 'Coche no encontrado' });

    if (String(coche.userId) !== req.usuario.id) {
      return res.status(403).json({ mensaje: 'No autorizado para modificar este coche' });
    }

    const { estado } = req.body;
    const estadosPermitidos = ['disponible', 'reservado', 'vendido'];
    if (!estadosPermitidos.includes(estado)) {
      return res.status(400).json({ mensaje: 'Estado no válido' });
    }

    coche.estado = estado;
    const actualizado = await coche.save();
    res.json(actualizado);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/coches/:id
router.delete('/:id', verificarToken, async (req, res, next) => {
  try {
    const coche = await Coche.findById(req.params.id);
    if (!coche) return res.status(404).json({ mensaje: 'Coche no encontrado' });

    if (String(coche.userId) !== req.usuario.id) {
      return res.status(403).json({ mensaje: 'No autorizado para eliminar este coche' });
    }

    await coche.deleteOne();
    res.json({ mensaje: 'Coche eliminado correctamente' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
