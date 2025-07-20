import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';

// Aquí puedes añadir más páginas cuando quieras
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Ruta fallback: redirige a Home */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}
