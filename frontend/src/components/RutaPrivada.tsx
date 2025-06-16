import { Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useEffect, useState } from 'react'

type Props = {
  children: JSX.Element
}

type DecodedToken = {
  id: number
  correo: string
  rol: string
  iat: number
  exp: number
}

export default function RutaPrivada({ children }: Props) {
  const [estado, setEstado] = useState<'cargando' | 'permitido' | 'denegado'>('cargando')

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      console.warn("❌ No hay token en localStorage")
      setEstado('denegado')
      return
    }

    try {
      console.log("Intentando decodificar token:", token)
      const decoded = jwtDecode<DecodedToken>(token)
      const ahora = Date.now() / 1000

      if (decoded.exp < ahora) {
        console.warn('⏰ Token expirado')
        localStorage.removeItem('token')
        setEstado('denegado')
        return
      }

      if (decoded.rol !== 'admin') {
        console.warn('🔒 Acceso denegado: no es admin')
        setEstado('denegado')
        return
      }

      setEstado('permitido')
    } catch (error) {
      console.error('❌ Token inválido en RutaPrivada', error)
      localStorage.removeItem('token')
      setEstado('denegado')
    }
  }, [])

  if (estado === 'cargando') return null
  if (estado === 'denegado') return <Navigate to="/login" replace />

  return children
}
