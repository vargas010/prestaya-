// frontend/src/pages/SolicitarPrestamo.tsx

import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RutaPrivada from '../components/RutaPrivada'
import { useUsuario } from '../hooks/useUsuario'

export default function SolicitarPrestamo() {
  const [monto, setMonto] = useState('')
  const [plazo, setPlazo] = useState('')
  const [motivo, setMotivo] = useState('')
  const [telefono, setTelefono] = useState('')
  const [archivos, setArchivos] = useState<FileList | null>(null)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState(false)
  const navigate = useNavigate()
  const usuario = useUsuario()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!monto || !plazo || !motivo || !telefono) {
      setError(true)
      setMensaje('Todos los campos son obligatorios')
      return
    }

    const formData = new FormData()
    formData.append('monto', monto)
    formData.append('plazo', plazo)
    formData.append('motivo', motivo)
    formData.append('telefono', telefono)

    if (archivos) {
      Array.from(archivos).forEach((file) => {
        formData.append('archivos', file)
      })
    }

    try {
      const res = await fetch('http://localhost:3000/api/prestamos', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: formData
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Error al solicitar préstamo')
      }

      setError(false)
      setMensaje('✅ Solicitud enviada correctamente')
      setMonto('')
      setPlazo('')
      setMotivo('')
      setArchivos(null)

      setTimeout(() => navigate('/'), 2000)
    } catch (err: any) {
      setError(true)
      setMensaje(err.message)
    }
  }

  if (!usuario) return null

  if (usuario.rol === 'admin') {
    return <p style={{ color: 'red' }}>Los administradores no pueden solicitar préstamos.</p>
  }

  return (
    <RutaPrivada>
      <div className="login-form">
        <h2>📄 Solicitar préstamo</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
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
          <input
            type="text"
            placeholder="Motivo del préstamo"
            value={motivo}
            onChange={e => setMotivo(e.target.value)}
          />

          <input
            type="tel"
            placeholder="Número de contacto"
            value={telefono}
            onChange={e => setTelefono(e.target.value)}
            required
          />

          <label>📎 Adjuntar documentos e imágenes:</label>
          <input
            type="file"
            name="archivos"
            accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png"
            multiple
            onChange={e => setArchivos(e.target.files)}
          />

          <button type="submit">Solicitar</button>
        </form>

        {mensaje && (
          <p className={error ? 'mensaje error' : 'mensaje exito'}>{mensaje}</p>
        )}
      </div>
    </RutaPrivada>
  )
}
