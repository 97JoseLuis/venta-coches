import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Detalles from '../pages/Detalles';
import Vender from '../pages/Vender';
import EditarCoche from '../pages/EditarCoche';
import AdminPanel from '../pages/AdminPanel';
import NavBar from '../components/NavBar';
import RutaProtegida from '../components/RutaProtegida';
import RutaAdmin from '../components/RutaAdmin';
import Footer from '../components/Footer';
import PoliticaCookies from '../pages/PoliticaCookies';
import CookieBanner from '../components/CookieBanner';

const AppRouter = () => {
  useEffect(() => {
    verificarTokenExpirado();
  }, []);

  const verificarTokenExpirado = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const ahora = Date.now() / 1000;

      if (decoded.exp < ahora) {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        window.location.href = '/login';
      }
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
  };

  return (
    <Router>
      <div className="app-container">
        <NavBar />
        <CookieBanner />
        <div className="content-wrap">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/detalles/:id" element={<Detalles />} />
            <Route path="/vender" element={
              <RutaProtegida>
                <Vender />
              </RutaProtegida>
            } />
            <Route path="/editar/:id" element={
              <RutaProtegida>
                <EditarCoche />
              </RutaProtegida>
            } />
            <Route path="/admin" element={
              <RutaAdmin>
                <AdminPanel />
              </RutaAdmin>
            } />
            <Route path="/politica-cookies" element={<PoliticaCookies />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default AppRouter;