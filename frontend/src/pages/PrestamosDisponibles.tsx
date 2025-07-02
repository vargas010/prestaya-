import { useEffect, useState } from 'react'
import RutaPrivada from '../components/RutaPrivada'
import { useUsuario } from '../hooks/useUsuario'

type Prestamo = {
  id: number
  monto: number
  plazo: number
  motivo: string
  telefono: string
  usuario: {
    nombre: string
    correo: string
  }
}

export default function PrestamosDisponibles() {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([])
  const usuario = useUsuario()

  useEffect(() => {
    const obtener = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/prestamos', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        const data = await res.json()
        const aprobados = data.filter((p: any) => p.estado === 'aprobado')
        setPrestamos(aprobados)
      } catch (err) {
        console.error('Error al cargar préstamos:', err)
      }
    }

    obtener()
  }, [])

  if (!usuario || usuario.rol !== 'prestamista') {
    return <p style={{ color: 'red' }}>Solo los prestamistas pueden ver esta sección.</p>
  }

  return (
    <RutaPrivada>
      <div className="contenedor">
        <h2>💼 Préstamos Aprobados Disponibles</h2>
        {prestamos.length === 0 ? (
          <p>No hay préstamos disponibles por ahora.</p>
        ) : (
          <table className="tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Solicitante</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Monto</th>
                <th>Plazo</th>
                <th>Motivo</th>
              </tr>
            </thead>
            <tbody>
              {prestamos.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.usuario.nombre}</td>
                  <td>{p.usuario.correo}</td>
                  <td>{p.telefono}</td>
                  <td>${p.monto}</td>
                  <td>{p.plazo} meses</td>
                  <td>{p.motivo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </RutaPrivada>
  )
}
