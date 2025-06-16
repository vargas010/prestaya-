// frontend/src/App.tsx

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './styles/App.css'
import Inicio from './pages/Inicio'
import Usuarios from './pages/Usuarios'
import Admin from './pages/Admin'
import UsuariosAdmin from './pages/admin/UsuariosAdmin'
import PrestamosAdmin from './pages/admin/PrestamosAdmin'
import PagosAdmin from './pages/admin/PagosAdmin'
import EstadisticasAdmin from './pages/admin/EstadisticasAdmin'
import Login from './pages/Login'
import RutaPrivada from './components/RutaPrivada'
import { useUsuario } from './hooks/useUsuario'

function App() {
  const usuario = useUsuario()
  console.log("usuario:", usuario)

  const cerrarSesion = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return (
    <Router>
      <nav className="navbar">
        <div className="nav-links">
          <Link to="/">Inicio</Link>
          <Link to="/usuarios">Usuarios</Link>
          {usuario?.rol === 'admin' && (
            <Link to="/admin">Admin</Link>
          )}

        </div>

        <div className="nav-user">
          {usuario ? (
            <>
              <span>👤 {usuario.correo}</span>
              <button onClick={cerrarSesion}>Cerrar Sesión</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Inicio />} />
        <Route path="/usuarios" element={<Usuarios />} />

        <Route
          path="/admin"
          element={
            <RutaPrivada>
              <Admin />
            </RutaPrivada>
          }
        >
          <Route path="usuarios" element={<UsuariosAdmin />} />
          <Route path="prestamos" element={<PrestamosAdmin />} />
          <Route path="pagos" element={<PagosAdmin />} />
          <Route path="estadisticas" element={<EstadisticasAdmin />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
