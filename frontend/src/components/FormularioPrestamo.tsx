// frontend/src/components/FormularioPrestamo.tsx
import { FormEvent, useState } from 'react'

export default function FormularioPrestamo({ onPrestamoCreado }: { onPrestamoCreado: () => void }) {
  const [monto, setMonto] = useState('')
  const [plazo, setPlazo] = useState('')
  const [motivo, setMotivo] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    if (!monto || !plazo || !motivo) {
      setError(true)
      setMensaje('Todos los campos son obligatorios')
      return
    }

    try {
      const res = await fetch('http://localhost:3000/api/prestamos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ monto, plazo, motivo })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Error al registrar préstamo')

      setMensaje('✅ Préstamo solicitado con éxito')
      setError(false)
      setMonto('')
      setPlazo('')
      setMotivo('')
      onPrestamoCreado()
    } catch (err: any) {
      setError(true)
      setMensaje(err.message || 'Error desconocido')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
      <input
        type="number"
        placeholder="Monto solicitado"
        value={monto}
        onChange={e => setMonto(e.target.value)}
      />
      <input
        type="number"
        placeholder="Plazo en meses"
        value={plazo}
        onChange={e => setPlazo(e.target.value)}
      />
      <textarea
        placeholder="Motivo del préstamo"
        value={motivo}
        onChange={e => setMotivo(e.target.value)}
      />
      <button type="submit">Solicitar Préstamo</button>

      {mensaje && (
        <p style={{ color: error ? 'red' : 'green' }}>{mensaje}</p>
      )}
    </form>
  )
}
