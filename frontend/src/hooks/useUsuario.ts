// frontend/src/hooks/useUsuario.ts

import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'

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
      const ahora = Date.now() / 1000

      if (decoded.exp < ahora) {
        localStorage.removeItem('token')
        setUsuario(null)
        window.location.href = '/login'
        return
      }

      setUsuario(decoded)

      // 🕒 Logout automático cuando expire el token
      const tiempoRestante = (decoded.exp - ahora) * 1000
      const timeout = setTimeout(() => {
        console.warn('🔒 Token expirado automáticamente')
        localStorage.removeItem('token')
        setUsuario(null)
        window.location.href = '/login'
      }, tiempoRestante)

      return () => clearTimeout(timeout)
    } catch (error) {
      console.error('❌ Token inválido', error)
      localStorage.removeItem('token')
      setUsuario(null)
      window.location.href = '/login'
    }
  }, [])

  return usuario
}
