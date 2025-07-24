import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './router/AppRouter';
import { AuthProvider } from './context/AuthContext';
import { HelmetProvider } from 'react-helmet-async'; // <-- Importación añadida
import './styles/global.css'; // Importar estilos globales

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>
);
