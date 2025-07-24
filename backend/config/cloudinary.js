const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configuración de Cloudinary con tus variables del .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuración del almacenamiento con Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'autoclick_uploads', // puedes cambiar el nombre si quieres
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

module.exports = { cloudinary, storage };
