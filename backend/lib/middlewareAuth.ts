// backend/lib/middlewareAuth.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken' // ✅ Necesario para usar jwt.verify
import { DecodedToken } from './types' // ✅ Solo si tienes el tipo, si no, créalo aquí o en otro archivo

export function requiereAuth(handler: any) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no enviado' })
    }

    const token = authHeader.split(' ')[1]

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken

      if (!decoded || decoded.rol !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado' })
      }

      return handler(req, res)
    } catch (error) {
      console.error('Error al verificar token:', error)
      return res.status(401).json({ error: 'Token inválido' })
    }
  }
}

