// frontend/src/pages/admin/EstadisticasAdmin.tsx

import { useEffect, useState } from 'react'

type Estadisticas = {
  totalUsuarios: number
  totalPrestamos: number
  totalPrestamosAprobados: number
  totalPrestamosRechazados: number
  totalPagos: number
  montoPrestado: number
  montoPagado: number
}

export default function EstadisticasAdmin() {
  const [data, setData] = useState<Estadisticas | null>(null)
  const [error, setError] = useState('')

  const obtenerEstadisticas = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/estadisticas', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setData(json)
    } catch (err: any) {
      setError(err.message)
    }
  }

  useEffect(() => {
    obtenerEstadisticas()
  }, [])

  if (error) return <p style={{ color: 'red' }}>❌ {error}</p>
  if (!data) return <p>Cargando estadísticas...</p>

  return (
    <div className="contenedor">
      <h2>📊 Estadísticas del Sistema</h2>
      <ul className="estadisticas-lista">
        <li>👥 Usuarios registrados: <strong>{data.totalUsuarios}</strong></li>
        <li>📄 Préstamos totales: <strong>{data.totalPrestamos}</strong></li>
        <li>✅ Aprobados: <strong>{data.totalPrestamosAprobados}</strong></li>
        <li>❌ Rechazados: <strong>{data.totalPrestamosRechazados}</strong></li>
        <li>💰 Total pagos registrados: <strong>{data.totalPagos}</strong></li>
        <li>💸 Monto total prestado: <strong>${data.montoPrestado.toFixed(2)}</strong></li>
        <li>💵 Monto total pagado: <strong>${data.montoPagado.toFixed(2)}</strong></li>
      </ul>
    </div>
  )
}
