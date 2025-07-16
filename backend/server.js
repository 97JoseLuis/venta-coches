const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config(); // Carga las variables de entorno desde .env
const mongoose = require('mongoose');

// Importar rutas
const cocheRoutes = require('./routes/cocheRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes'); // Ruta para registro de usuarios

// Middlewares
app.use(cors());
app.use(express.json());

// Servir archivos estáticos como imágenes subidas
app.use('/uploads', express.static('uploads'));

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch((err) => console.error('Error al conectar con MongoDB:', err));

// Rutas API
app.use('/api/coches', cocheRoutes);
app.use('/api/usuarios', usuarioRoutes); // Ruta de usuarios (registro, login, etc.)

// Middleware para rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

// Middleware global para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});

// Puerto del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
