const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const Usuario = require('./models/usuario');

async function crearUsuarios() {
try {
await mongoose.connect(process.env.MONGO_URI);
console.log('Conectado a MongoDB');

const usuarios = [
  {
    nombre: 'Usuario 1',
    email: 'normal1@autoclick.com',
    password: await bcrypt.hash('clave123', 10),
    telefono: '123456789',
    rol: 'usuario',
  },
  {
    nombre: 'Usuario 2',
    email: 'normal2@autoclick.com',
    password: await bcrypt.hash('clave123', 10),
    telefono: '987654321',
    rol: 'usuario',
  },
  {
    nombre: 'Administrador',
    email: 'admin@autoclick.com',
    password: await bcrypt.hash('admin123', 10),
    rol: 'admin',
  },
];

await Usuario.deleteMany({ email: { $in: usuarios.map((u) => u.email) } });
await Usuario.insertMany(usuarios);
console.log('Usuarios creados correctamente');

await mongoose.disconnect();
} catch (error) {
console.error('Error al crear usuarios: ', error);
await mongoose.disconnect();
}
}

crearUsuarios();