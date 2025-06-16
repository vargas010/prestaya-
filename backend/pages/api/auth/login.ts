import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import bcrypt from 'bcrypt'
import { generarToken } from '../../../lib/auth'
import { permitirCors } from '../../../lib/cors'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const { correo, password } = req.body

  if (!correo || !password) {
    return res.status(400).json({ error: 'Correo y contraseña requeridos' })
  }

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { correo }
    })


    if (!usuario) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' })
    }

    const match = await bcrypt.compare(password, usuario.password)

    if (!match) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' })
    }

    const token = generarToken({
      id: usuario.id,
      correo: usuario.correo,
      rol: usuario.rol  // 👈 Añadimos el rol
    })


    res.status(200).json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// ✅ Exportar correctamente con CORS habilitado
export default permitirCors(handler)
