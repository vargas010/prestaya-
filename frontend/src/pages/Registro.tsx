// frontend/src/pages/Registro.tsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Registro() {
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [rol, setRol] = useState<'usuario' | 'prestamista'>('usuario')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(false)
    setMensaje('')

    try {
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, password, rol })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setMensaje('✅ Usuario creado correctamente. Redirigiendo...')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err: any) {
      setError(true)
      setMensaje(err.message || 'Error de red')
    }
  }

  return (
    <div className="login-form">
      <h2>📝 Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={e => setCorreo(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <select value={rol} onChange={e => setRol(e.target.value as 'usuario' | 'prestamista')}>
          <option value="usuario">Solicitar préstamo</option>
          <option value="prestamista">Ofrecer préstamo</option>
        </select>

        <button type="submit">Registrarse</button>
      </form>

      {mensaje && (
        <p className={error ? 'mensaje error' : 'mensaje exito'}>{mensaje}</p>
      )}

      <p style={{ marginTop: '10px' }}>
        ¿Ya tienes cuenta?{' '}
        <a href="/login" style={{ color: 'blue' }}>
          Inicia sesión
        </a>
      </p>
    </div>
  )
}
