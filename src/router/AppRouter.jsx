import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Detalles from '../pages/Detalles';
import NavBar from '../components/NavBar';
import RutaPrivada from '../components/RutaPrivada';
import Vender from '../pages/Vender';
import RutaAdmin from '../components/RutaAdmin';
import AdminPanel from '../pages/AdminPanel';
import EditarCoche from '../pages/EditarCoche';


const AppRouter = () => {
  return (
    <Router>
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/detalles/:id" element={<Detalles />} />
        <Route path="/admin" element={
          <RutaAdmin>
            <AdminPanel />
          </RutaAdmin>
        } />
        {/* Ruta protegida solo para usuarios autenticados */}
        <Route path="/vender" element={
          <RutaPrivada>
            <Vender />
          </RutaPrivada>
        } />
        <Route path="/editar/:id" element={<EditarCoche />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
