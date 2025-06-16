// frontend/src/pages/Admin.tsx

import { Link, Outlet } from 'react-router-dom'

export default function Admin() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Admin</h2>
        <nav>
          <ul>
            <li><Link to="usuarios">Usuarios</Link></li>
            <li><Link to="prestamos">Préstamos</Link></li>
            <li><Link to="pagos">Pagos</Link></li>
            <li><Link to="estadisticas">Estadísticas</Link></li>
          </ul>
        </nav>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
