// frontend/src/hooks/useUsuario.ts

import { useEffect, useState } from 'react'
import jwtDecode from 'jwt-decode'

type DecodedToken = {
  id: number
  correo: string
  rol: string
  iat: number
  exp: number
}

export function useUsuario() {
  const [usuario, setUsuario] = useState<DecodedToken | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token || token.trim() === '') {
      setUsuario(null)
      return
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token)

      const ahora = Date.now() / 1000 // Tiempo actual en segundos
      if (decoded.exp < ahora) {
        console.warn('Token expirado (useUsuario)')
        localStorage.removeItem('token')
        setUsuario(null)
        return
      }

      setUsuario(decoded)
    } catch (error) {
      console.error('Token inválido (useUsuario)', error)
      localStorage.removeItem('token')
      setUsuario(null)
    }
  }, [])

  return usuario
}
