// backend/lib/auth.ts

import jwt from 'jsonwebtoken'

export function verificarToken(token: string) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET!)
  return decoded as {
    id: number
    correo: string
    rol: string
    iat: number
    exp: number
  }
}


const SECRET = process.env.JWT_SECRET || 'secreto123'

export function generarToken(payload: any) {
  return jwt.sign(payload, SECRET, { expiresIn: '1h' })
}
