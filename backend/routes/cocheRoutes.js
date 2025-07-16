const express = require('express');
const router = express.Router();
const multer = require('multer');
const Coche = require('../models/Coche');
const verificarToken = require('../middleware/verificarToken');

// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Crear coche (protegido)
router.post('/', verificarToken, upload.single('imagen'), async (req, res, next) => {
  try {
    const { marca, modelo, anio, precio, descripcion } = req.body;
    const imagen = req.file ? `/uploads/${req.file.filename}` : '';

    const nuevoCoche = new Coche({
      marca,
      modelo,
      anio,
      precio,
      descripcion,
      imagen,
      userId: req.usuario.id
    });

    const cocheGuardado = await nuevoCoche.save();
    res.status(201).json(cocheGuardado);
  } catch (error) {
    next(error);
  }
});

// Obtener todos los coches
router.get('/', async (req, res, next) => {
  try {
    const coches = await Coche.find();
    res.json(coches);
  } catch (error) {
    next(error);
  }
});

// Obtener coche por ID
router.get('/:id', async (req, res, next) => {
  try {
    const coche = await Coche.findById(req.params.id);
    if (!coche) return res.status(404).json({ mensaje: 'Coche no encontrado' });
    res.json(coche);
  } catch (error) {
    next(error);
  }
});

// Eliminar coche (solo dueño)
router.delete('/:id', verificarToken, async (req, res, next) => {
  try {
    const coche = await Coche.findById(req.params.id);
    if (!coche) return res.status(404).json({ mensaje: 'Coche no encontrado' });

    if (coche.userId.toString() !== req.usuario.id) {
      return res.status(403).json({ mensaje: 'No tienes permiso para eliminar este coche' });
    }

    await coche.deleteOne();
    res.json({ mensaje: 'Coche eliminado correctamente' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
