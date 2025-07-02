// frontend/src/pages/admin/PrestamosAdmin.tsx

import { useEffect, useState } from 'react'
import React from 'react'

type Prestamo = {
  id: number
  monto: number
  plazo: number
  motivo: string
  estado: string
  creadoEn: string
  usuario: {
    correo: string
  }
  archivos?: {
    id: number
    url: string
    tipo: string
  }[]
}

export default function PrestamosAdmin() {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([])
  const [filtro, setFiltro] = useState<'todos' | 'pendiente' | 'aprobado' | 'rechazado'>('todos')
  const [error, setError] = useState('')
  const [prestamoExpandido, setPrestamoExpandido] = useState<number | null>(null)
  const [busquedaCorreo, setBusquedaCorreo] = useState('')

  const obtenerPrestamos = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/prestamos', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setPrestamos(data)
    } catch (err: any) {
      setError(err.message)
    }
  }

  useEffect(() => {
    obtenerPrestamos()
  }, [])

  const prestamosFiltrados = prestamos.filter(p =>
    (filtro === 'todos' || p.estado === filtro) &&
    p.usuario.correo.toLowerCase().includes(busquedaCorreo.toLowerCase())
  )

  const cambiarEstado = async (id: number, nuevoEstado: 'aprobado' | 'rechazado') => {
    try {
      const res = await fetch('http://localhost:3000/api/prestamos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ id, estado: nuevoEstado })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      obtenerPrestamos()
    } catch (err: any) {
      alert('❌ Error al actualizar estado: ' + err.message)
    }
  }

  return (
    <div className="contenedor">
      <h2>📋 Préstamos Registrados</h2>

      <div style={{ marginBottom: '1rem' }}>
        <strong>Filtrar por estado:</strong>{' '}
        <button onClick={() => setFiltro('todos')}>Todos</button>{' '}
        <button onClick={() => setFiltro('pendiente')}>Pendientes</button>{' '}
        <button onClick={() => setFiltro('aprobado')}>Aprobados</button>{' '}
        <button onClick={() => setFiltro('rechazado')}>Rechazados</button>
      </div>

      <div style={{ marginTop: '10px' }}>
        <label>Buscar por correo: </label>
        <input
          type="text"
          value={busquedaCorreo}
          onChange={(e) => setBusquedaCorreo(e.target.value)}
          placeholder="usuario@email.com"
          style={{ padding: '5px', width: '250px' }}
        />
      </div>

      {error && <p style={{ color: 'red' }}>❌ {error}</p>}

      {prestamosFiltrados.length === 0 ? (
        <p>No hay préstamos con ese estado.</p>
      ) : (
        <table className="tabla">
          <thead>
            <tr>
              <th>ID</th>
              <th>Correo</th>
              <th>Monto</th>
              <th>Plazo</th>
              <th>Motivo</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {prestamosFiltrados.map(p => (
              <React.Fragment key={p.id}>
                <tr>
                  <td>{p.id}</td>
                  <td>{p.usuario.correo}</td>
                  <td>${p.monto}</td>
                  <td>{p.plazo} meses</td>
                  <td>{p.motivo}</td>
                  <td>
                    {p.estado === 'pendiente' ? (
                      <>
                        <button onClick={() => cambiarEstado(p.id, 'aprobado')}>✅</button>{' '}
                        <button onClick={() => cambiarEstado(p.id, 'rechazado')}>❌</button>
                      </>
                    ) : (
                      <span className={`estado-tag estado-${p.estado}`}>{p.estado}</span>
                    )}
                  </td>
                  <td>{new Date(p.creadoEn).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => setPrestamoExpandido(p.id === prestamoExpandido ? null : p.id)}>
                      {prestamoExpandido === p.id ? 'Ocultar' : 'Ver detalles'}
                    </button>
                  </td>
                </tr>

                {prestamoExpandido === p.id && (
                  <tr>
                    <td colSpan={8}>
                      <div style={{ background: '#f9f9f9', padding: '10px', borderRadius: '8px' }}>
                        <p><strong>Motivo completo:</strong> {p.motivo}</p>
                        <p><strong>Correo del usuario:</strong> {p.usuario.correo}</p>
                        <p><strong>Monto:</strong> ${p.monto}</p>
                        <p><strong>Plazo:</strong> {p.plazo} meses</p>
                        <p><strong>Fecha de solicitud:</strong> {new Date(p.creadoEn).toLocaleString()}</p>
                        <p><strong>Estado:</strong> {p.estado}</p>

                        {/* Archivos adjuntos */}
                        {p.archivos && p.archivos.length > 0 && (
                        <>
                            <p><strong>Archivos subidos:</strong></p>
                            <ul>
                            {p.archivos.map(a => (
                                <li key={a.id}>
                                {a.tipo === 'imagen' ? (
                                    <img
                                    src={`http://localhost:3000/api/uploads/${a.url}`}
                                    alt="archivo"
                                    style={{ maxWidth: '150px', marginBottom: '10px' }}
                                    />
                                ) : (
                                    <a
                                    href={`http://localhost:3000/api/uploads/${a.url}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    >
                                    📄 {a.url}
                                    </a>
                                )}
                                </li>
                            ))}
                            </ul>
                        </>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
