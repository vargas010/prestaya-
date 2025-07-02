// frontend/src/pages/admin/PagosAdmin.tsx

import { useEffect, useState } from 'react'

type Pago = {
  id: number
  monto: number
  fecha: string
  prestamo: {
    id: number
    usuario: {
      correo: string
    }
  }
}

type Prestamo = {
  id: number
  usuario: {
    correo: string
  }
}

export default function PagosAdmin() {
  const [pagos, setPagos] = useState<Pago[]>([])
  const [prestamos, setPrestamos] = useState<Prestamo[]>([])
  const [prestamoId, setPrestamoId] = useState('')
  const [monto, setMonto] = useState('')
  const [mensaje, setMensaje] = useState('')

  const obtenerPagos = async () => {
    const res = await fetch('http://localhost:3000/api/pagos', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    const data = await res.json()
    setPagos(data)
  }

  const obtenerPrestamos = async () => {
    const res = await fetch('http://localhost:3000/api/prestamos', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    const data = await res.json()
    setPrestamos(data)
  }

  const registrarPago = async () => {
    setMensaje('')

    const montoNum = parseFloat(monto)

    if (!prestamoId || !monto.trim()) {
        setMensaje('❌ Completa todos los campos')
        return
    }

    if (isNaN(montoNum) || montoNum <= 0) {
        setMensaje('❌ El monto debe ser un número positivo')
        return
    }

    try {
        const res = await fetch('http://localhost:3000/api/pagos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ prestamoId, monto: montoNum })
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.error)

        setMensaje('✅ Pago registrado con éxito')
        setPrestamoId('')
        setMonto('')
        obtenerPagos()
    } catch (err: any) {
        setMensaje(`❌ Error: ${err.message}`)
    }
    }


  useEffect(() => {
    obtenerPagos()
    obtenerPrestamos()
  }, [])

  return (
    <div className="contenedor">
      <h2>💸 Gestión de Pagos</h2>

      {mensaje && <p className="mensaje">{mensaje}</p>}

      <div className="formulario">
        <select value={prestamoId} onChange={e => setPrestamoId(e.target.value)}>
          <option value="">Selecciona un préstamo</option>
          {prestamos.map(p => (
            <option key={p.id} value={p.id}>
              #{p.id} - {p.usuario.correo}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Monto del pago"
          value={monto}
          onChange={e => setMonto(e.target.value)}
        />
        <button onClick={registrarPago}>Registrar Pago</button>
      </div>

      <table className="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Préstamo</th>
            <th>Monto</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {pagos.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.prestamo.usuario.correo}</td>
              <td>#{p.prestamo.id}</td>
              <td>${p.monto}</td>
              <td>{new Date(p.fecha).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
