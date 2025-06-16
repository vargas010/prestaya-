// frontend/src/components/FormularioUsuario.tsx

import { FormEvent, useState } from 'react'

interface Props {
  onUsuarioCreado: () => void
}

export default function FormularioUsuario({ onUsuarioCreado }: Props) {
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [rol, setRol] = useState('usuario') // 👈 Estado para el rol
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!nombre || !correo || !password || !rol) {
      setError(true)
      setMensaje('Todos los campos son obligatorios')
      return
    }

    fetch('http://localhost:3000/api/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: JSON.stringify({ nombre, correo, password, rol }),
    })
      .then(async res => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || 'Error al registrar')
        }

        setError(false)
        setMensaje('¡Usuario registrado exitosamente!')
        setNombre('')
        setCorreo('')
        setPassword('')
        setRol('usuario')
        onUsuarioCreado()
      })
      .catch(err => {
        setError(true)
        setMensaje(err.message || 'Error desconocido')
      })
  }

  return (
    <form onSubmit={handleSubmit} className="formulario">
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Correo"
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

      {/* Selector de rol */}
      <select value={rol} onChange={e => setRol(e.target.value)} required>
        <option value="usuario">Usuario</option>
        <option value="admin">Administrador</option>
      </select>

      <button type="submit">Registrar</button>

      {mensaje && (
        <p className={error ? 'mensaje error' : 'mensaje exito'}>
          {mensaje}
        </p>
      )}
    </form>
  )
}
