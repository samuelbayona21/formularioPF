import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Examen from './pages/Examen';
import Resultado from './pages/Resultado';
import AdminDashboard from './pages/AdminDashboard';
import AdminDetalle from './pages/AdminDetalle';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/examen" element={<Examen />} />
        <Route path="/resultado" element={<Resultado />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/resultado/:intentoId" element={<AdminDetalle />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
