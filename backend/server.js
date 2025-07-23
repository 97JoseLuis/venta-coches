const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const app = express();

// Cargar variables de entorno según entorno actual
const env = process.env.NODE_ENV || 'development';
require('dotenv').config({ path: `.env.${env}` });

// Validar carpeta uploads
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
  console.log('Carpeta uploads creada automáticamente.');
}

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(uploadsPath));

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(`MongoDB conectado en ${process.env.MONGO_URI}`))
  .catch((err) => console.error(`Error al conectar con MongoDB: ${err.message}`));

// Verificar coches existentes
const Coche = require('./models/coche');
Coche.find().then(coches => {
  console.log(`Coches existentes: ${coches.length}`);
}).catch(err => {
  console.error(`Error al buscar coches: ${err.message}`);
});

// Rutas
const cocheRoutes = require('./routes/cocheRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

app.use('/api/coches', cocheRoutes);
app.use('/api/usuarios', usuarioRoutes);

// Middlewares de error
const { rutaNoEncontrada, errorServidor } = require('./middleware/manejoErrores');
app.use(rutaNoEncontrada);
app.use(errorServidor);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT} (modo ${env})`);
});
