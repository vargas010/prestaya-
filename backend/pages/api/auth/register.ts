// backend/pages/api/auth/register.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import bcrypt from 'bcrypt'
import { permitirCors } from '../../../lib/cors'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const { nombre, correo, password, rol } = req.body

  if (!nombre || !correo || !password || !rol) {
    return res.status(400).json({ error: 'Faltan campos requeridos' })
  }

  if (!['usuario', 'prestamista'].includes(rol)) {
    return res.status(400).json({ error: 'Rol inválido' })
  }

  try {
    const existe = await prisma.usuario.findUnique({ where: { correo } })
    if (existe) {
      return res.status(409).json({ error: 'Este correo ya está registrado' })
    }

    const hashed = await bcrypt.hash(password, 10)

    const nuevo = await prisma.usuario.create({
      data: {
        nombre,
        correo,
        password: hashed,
        rol
      },
      select: {
        id: true,
        nombre: true,
        correo: true,
        rol: true,
        creadoEn: true
      }
    })

    res.status(201).json({ mensaje: 'Usuario creado', usuario: nuevo })
  } catch (error) {
    console.error('❌ Error al registrar usuario:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export default permitirCors(handler)
