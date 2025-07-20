# 🚗 AutoClickCar - Plataforma de Compra/Venta de Coches de Segunda Mano

Bienvenido a **AutoClickCar**, una aplicación web donde los usuarios pueden registrar, publicar, editar y eliminar anuncios de coches usados. El proyecto cuenta con autenticación de usuarios, gestión de roles (usuario/admin), subida de imágenes, filtros de búsqueda y un panel de administración.

---

## 📁 Estructura del Proyecto

venta-coches/
│
├── backend/ # Servidor Express con MongoDB
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── uploads/ # Imágenes de coches
│ ├── .env # Variables de entorno del servidor
│ └── server.js
│
├── frontend/ # Interfaz en React + Vite
│ ├── public/ # Archivos estáticos
│ ├── src/
│ │ ├── assets/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── services/
│ │ ├── styles/
│ │ └── main.jsx
│ ├── .env # Variables del cliente
│ └── vite.config.js
│
└── README.md

yaml
Copiar
Editar

---

## ⚙️ Tecnologías Utilizadas

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Base de Datos**: MongoDB Atlas
- **Autenticación**: JSON Web Tokens (JWT)
- **Subida de imágenes**: Multer
- **Despliegue**:
  - Cliente: Vercel
  - Servidor: Render

---

## 🚀 Funcionalidades

### 🧑 Usuario
- Registro / Login con JWT
- Crear, editar y eliminar sus propios anuncios
- Subida de imágenes para el coche
- Ver detalles del anuncio
- Contactar con el anunciante (correo y teléfono)

### 🔍 Buscador dinámico
- Filtrar por marca y modelo
- Visualización atractiva de cada coche
- Vídeo de fondo para dar dinamismo

### 🔐 Admin
- Panel de administración para gestionar usuarios y coches

---

## 📝 Variables de Entorno

### backend/.env

PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/venta_coches
JWT_SECRET=miclaveultrasecreta

shell
Copiar
Editar

### frontend/.env

VITE_API_URL_COCHES=http://localhost:5000/api/coches
VITE_API_URL_USUARIOS=http://localhost:5000/api/usuarios

yaml
Copiar
Editar

---

## 🧪 Instalación y ejecución local

```bash
# Clona el repositorio
git clone https://github.com/97JoseLuis/venta-coches.git
cd venta-coches

# Instalar backend
cd backend
npm install
npm run dev

# Instalar frontend
cd ../frontend
npm install
npm run dev
🌍 Despliegue
Frontend: desplegado con Vercel

Backend: desplegado en Render

Asegúrate de configurar variables de entorno en ambos entornos antes de desplegar

📜 Licencia
Este proyecto se distribuye bajo la licencia MIT.

✨ Autor
Desarrollado por José Luis Quintero

Proyecto para portafolio personal / práctica de desarrollo full-stack