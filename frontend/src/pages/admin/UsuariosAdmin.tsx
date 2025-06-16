// frontend/src/pages/admin/UsuariosAdmin.tsx

import { useEffect, useState } from 'react'
import FormularioUsuario from '../../components/FormularioUsuario'
import EditarUsuario from '../../components/EditarUsuario'

type Usuario = {
  id: number
  nombre: string
  correo: string
  rol: string
}

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [error, setError] = useState('')
  const [editandoUsuario, setEditandoUsuario] = useState<Usuario | null>(null)

  const cargarUsuarios = () => {
    const token = localStorage.getItem('token')

    fetch('http://localhost:3000/api/usuarios', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(err => setError('Error al cargar usuarios'))
  }

  useEffect(() => {
    cargarUsuarios()
  }, [])

  const eliminarUsuario = async (id: number) => {
    const token = localStorage.getItem('token')
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return

    try {
      const res = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!res.ok) {
        throw new Error('No se pudo eliminar el usuario')
      }

      cargarUsuarios()
    } catch (err) {
      alert('Error al eliminar')
    }
  }

  return (
    <div>
      <h2>👥 Usuarios registrados</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <FormularioUsuario onUsuarioCreado={cargarUsuarios} />

      {editandoUsuario && (
        <EditarUsuario usuario={editandoUsuario} onActualizado={cargarUsuarios} />
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.nombre}</td>
              <td>{usuario.correo}</td>
              <td>{usuario.rol}</td>
              <td>
                <button onClick={() => setEditandoUsuario(usuario)}>Editar</button>
                <button
                  onClick={() => eliminarUsuario(usuario.id)}
                  style={{
                    backgroundColor: 'red',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    marginLeft: '5px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
