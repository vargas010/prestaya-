// frontend/src/components/RutaPrivada.tsx

import { Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useEffect, useState } from 'react'
import React from 'react'

type Props = {
  children: React.ReactNode
  soloAdmin?: boolean
  soloUsuario?: boolean
}

type DecodedToken = {
  id: number
  correo: string
  rol: string
  iat: number
  exp: number
}

export default function RutaPrivada({ children, soloAdmin, soloUsuario }: Props) {
  const [estado, setEstado] = useState<'cargando' | 'permitido' | 'denegado'>('cargando')

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      setEstado('denegado')
      return
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token)
      const ahora = Date.now() / 1000

      if (decoded.exp < ahora) {
        localStorage.removeItem('token')
        setEstado('denegado')
        return
      }

      if (soloAdmin && decoded.rol !== 'admin') {
        setEstado('denegado')
        return
      }

      if (soloUsuario && decoded.rol !== 'usuario') {
        setEstado('denegado')
        return
      }

      setEstado('permitido')
    } catch (error) {
      console.error('❌ Token inválido', error)
      localStorage.removeItem('token')
      setEstado('denegado')
    }
  }, [soloAdmin, soloUsuario])

  if (estado === 'cargando') return null
  if (estado === 'denegado') return <Navigate to="/login" replace />

  return <>{children}</>
}
