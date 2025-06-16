// frontend/src/pages/Usuarios.tsx

import { useEffect, useState } from 'react'
import FormularioUsuario from '../components/FormularioUsuario'

type Usuario = {
  id: number
  nombre: string
  correo: string
}

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])

  useEffect(() => {
    cargarUsuarios()
  }, [])

  const cargarUsuarios = () => {
    fetch('http://localhost:3000/api/usuarios')
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(err => console.error('Error:', err))
  }

  return (
    <div className="contenedor">
      <h1>Usuarios</h1>
      <FormularioUsuario onUsuarioCreado={cargarUsuarios} />
      <ul>
        {usuarios.map(usuario => (
          <li key={usuario.id}>
            <strong>{usuario.nombre}</strong> – {usuario.correo}
          </li>
        ))}
      </ul>
    </div>
  )
}
