// frontend/src/components/EditarUsuario.tsx

import { FormEvent, useState } from 'react'

interface Usuario {
  id: number
  nombre: string
  correo: string
  rol: string
}

interface Props {
  usuario: Usuario
  onActualizado: () => void   // <-- ESTA LÍNEA es la clave
}

export default function EditarUsuario({ usuario, onActualizado }: Props) {
  const [nombre, setNombre] = useState(usuario.nombre)
  const [correo, setCorreo] = useState(usuario.correo)
  const [rol, setRol] = useState(usuario.rol)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const token = localStorage.getItem('token')

    try {
      const res = await fetch(`http://localhost:3000/api/usuarios/${usuario.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ nombre, correo, rol })
      })

      if (!res.ok) {
        throw new Error('Error al actualizar usuario')
      }

      onActualizado()
    } catch (error) {
      alert('Error actualizando usuario')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Editar Usuario</h3>
      <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" />
      <input value={correo} onChange={e => setCorreo(e.target.value)} placeholder="Correo" />
      <select value={rol} onChange={e => setRol(e.target.value)}>
        <option value="usuario">Usuario</option>
        <option value="admin">Administrador</option>
      </select>
      <button type="submit">Guardar Cambios</button>
    </form>
  )
}
