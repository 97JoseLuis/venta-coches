import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './router/AppRouter';
import { AuthProvider } from './context/AuthContext';
import './styles/global.css'; // Importar estilos globales

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      {/* Proveedor de contexto para la autenticación */}
    <AppRouter />   
    </AuthProvider>
  </React.StrictMode>
);
