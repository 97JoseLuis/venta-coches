const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Definimos el esquema de usuario
const usuarioSchema = new mongoose.Schema({
nombre: {
type: String,
required: true,
},
email: {
type: String,
required: true,
unique: true, // No se permiten emails duplicados
},
password: {
type: String,
required: true,
},
rol: {
type: String,
enum: ['usuario', 'admin'],
default: 'usuario',
},
}, {
timestamps: true,
});

// Middleware: encripta la contraseña antes de guardar (por si se guarda individualmente)
usuarioSchema.pre('save', async function (next) {
if (!this.isModified('password')) return next();
try {
const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password, salt);
next();
} catch (error) {
next(error);
}
});

module.exports = mongoose.model('Usuario', usuarioSchema);