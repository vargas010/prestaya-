// backend/lib/proteger.ts

import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'
import { verificarToken } from './auth'

export function proteger(handler: NextApiHandler, opciones: { soloAdmin?: boolean } = {}) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'Token no enviado' })
    }

    try {
      const decoded = verificarToken(token)

      if (opciones.soloAdmin && decoded.rol !== 'admin') {
        return res.status(403).json({ error: 'Acceso restringido a administradores' })
      }

      // ✔️ El token es válido → lo guardamos en req para acceso en handler
      ;(req as any).usuario = decoded

      return handler(req, res)
    } catch (error) {
      console.error('❌ Token inválido en middleware proteger', error)
      return res.status(401).json({ error: 'Token inválido' })
    }
  }
}
