const express = require('express');
const router = express.Router();
const path = require('path');

// Modelos y Middlewares
const Coche = require('../models/coche');
const verificarToken = require('../middleware/verificarToken');

// Cloudinary + Multer setup
const multer = require('multer');
const { storage } = require('../config/cloudinary'); // Asegúrate de tener este archivo
const upload = multer({ storage });

// ───────────────────────────────────────────────
// GET /api/coches/filtros/opciones
router.get('/filtros/opciones', async (req, res, next) => {
  try {
    const coches = await Coche.find({}, 'marca modelo');
    const opciones = {};

    coches.forEach(c => {
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
  async (req, res, next) => {
    try {
      if (!req.usuario?.id) {
        return res.status(401).json({ mensaje: 'No se pudo obtener el usuario autenticado' });
      }

      const { marca, modelo, anio, precio, descripcion } = req.body;

      if (!marca || !modelo || !anio || !precio || !descripcion) {
        return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
      }

      const imagenUrl = req.file?.path || '';

      const nuevoCoche = new Coche({
        marca,
        modelo,
        anio,
        precio,
        descripcion,
        estado: 'disponible',
        imagen: imagenUrl,
        userId: req.usuario.id,
      });

      const guardado = await nuevoCoche.save();
      res.status(201).json(guardado);
    } catch (err) {
      console.error('Error al crear coche:', err);
      res.status(500).json({ mensaje: 'Error al crear coche' });
    }
  }
);

// PUT /api/coches/:id
router.put('/:id', verificarToken, upload.single('imagen'), async (req, res, next) => {
  try {
    const coche = await Coche.findById(req.params.id);
    if (!coche) return res.status(404).json({ mensaje: 'Coche no encontrado' });

    if (String(coche.userId) !== String(req.usuario.id))
      return res.status(403).json({ mensaje: 'No autorizado para editar este coche' });

    coche.marca = req.body.marca || coche.marca;
    coche.modelo = req.body.modelo || coche.modelo;
    coche.anio = req.body.anio || coche.anio;
    coche.precio = req.body.precio || coche.precio;
    coche.descripcion = req.body.descripcion || coche.descripcion;

    if (req.file) {
      coche.imagen = req.file.path;
    }

    const actualizado = await coche.save();
    res.json(actualizado);
  } catch (err) {
    next(err);
  }
});

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
