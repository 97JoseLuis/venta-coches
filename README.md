# 🚗 AutoClickCar - Plataforma de Compra/Venta de Coches de Segunda Mano

Bienvenido a **AutoClickCar**, una aplicación web donde los usuarios pueden publicar, editar y eliminar anuncios de coches usados. Incluye autenticación, subida de imágenes, filtros dinámicos, contacto con el anunciante y panel de administrador.

## 📁 Estructura del Proyecto

venta-coches/
│
├── backend/ # Backend en Express + MongoDB
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── uploads/ # Imágenes de coches
│ ├── .env # Variables de entorno del backend
│ └── server.js
│
├── public/ # Archivos estáticos (video, imágenes base)
├── src/ # Frontend en React
│ ├── assets/
│ ├── components/
│ ├── pages/
│ ├── services/
│ ├── styles/
│ ├── AppRouter.jsx
│ └── main.jsx
│
├── .env # Variables del frontend (VITE_)
├── index.html
├── package.json
└── vite.config.js

## ⚙️ Tecnologías Utilizadas

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Base de Datos**: MongoDB Atlas
- **Autenticación**: JWT
- **Subida de Imágenes**: Multer
- **Despliegue**:
  - Cliente: Vercel
  - Servidor: Render

## 🚀 Funcionalidades

✅ Registro / Login  
✅ Publicar, editar y eliminar coches  
✅ Subida de imágenes  
✅ Filtro por marca y modelo  
✅ Panel de administrador  
✅ Contactar con el anunciante (correo y teléfono)  
✅ Footer y política de cookies  
✅ Autenticación y control de permisos

## 🧪 Instalación local

# Clonar el repositorio
git clone https://github.com/97JoseLuis/venta-coches.git
cd venta-coches

# Configurar variables de entorno en backend/.env y .env del frontend

# Instalar dependencias del backend
cd backend
npm install
npm run dev

# Instalar dependencias del frontend (raíz)
cd ..
npm install
npm run dev

🔐 Variables de entorno
backend/.env

PORT=5000
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/venta_coches
JWT_SECRET=miclaveultrasecreta

.env (frontend, en raíz del proyecto)

VITE_API_URL_COCHES=https://tubackend.render.com/api/coches
VITE_API_URL_USUARIOS=https://tubackend.render.com/api/usuarios
🌍 Despliegue
Frontend: Vercel

Backend: Render


📄 Licencia
MIT License.

✨ Autor
Proyecto creado por José Luis Quintero.
Desarrollado con ❤️ como parte de práctica Full-Stack.