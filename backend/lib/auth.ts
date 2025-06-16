// backend/lib/auth.ts

import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'secreto123'

export function generarToken(payload: any) {
  return jwt.sign(payload, SECRET, { expiresIn: '1h' })
}
