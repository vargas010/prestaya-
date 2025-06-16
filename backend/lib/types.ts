// backend/lib/types.ts

export type DecodedToken = {
  id: number
  correo: string
  rol: string
  iat: number
  exp: number
}
