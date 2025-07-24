const Coche = require('../models/coche');

// Obtener todos los coches
exports.getAllCoches = async (req, res, next) => {
  try {
    const coches = await Coche.find(); // Busca todos los coches en la DB
    res.json(coches);
  } catch (error) {
    next(error); // Enviar el error al middleware de manejo de errores
  }
};

// Crear un nuevo coche
exports.createCoche = async (req, res, next) => {
  try {
    const {
      marca,
      modelo,
      anio,
      precio,
      descripcion,
      estado,
      userId
    } = req.body;

    const imagen = req.file ? `/uploads/${req.file.filename}` : null;

    const nuevoCoche = new Coche({
      marca,
      modelo,
      anio,
      precio,
      descripcion,
      estado,
      userId,
      imagen
    });

    const cocheGuardado = await nuevoCoche.save();
    res.status(201).json(cocheGuardado);
  } catch (error) {
    next(error);
  }
};

// Obtener un coche por ID
exports.getCocheById = async (req, res, next) => {
   try {
    const coche = await Coche.findById(req.params.id).populate('userId', 'nombre email');

    if (!coche) {
      return res.status(404).json({ mensaje: 'Coche no encontrado' });
    }

    res.json(coche);
  } catch (error) {
    next(error);
  }
};

// Actualizar un coche por ID
exports.updateCoche = async (req, res, next) => {
  try {
    const cocheActualizado = await Coche.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cocheActualizado) {
      return res.status(404).json({ mensaje: 'Coche no encontrado para actualizar' });
    }
    res.json(cocheActualizado);
  } catch (error) {
    next(error);
  }
};

// Borrar un coche por ID
exports.deleteCoche = async (req, res, next) => {
  try {
    const cocheBorrado = await Coche.findByIdAndDelete(req.params.id);
    if (!cocheBorrado) {
      return res.status(404).json({ mensaje: 'Coche no encontrado para borrar' });
    }
    res.json({ mensaje: 'Coche eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};
