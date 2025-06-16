import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import bcrypt from 'bcrypt'
import { permitirCors } from '../../../lib/cors'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const { nombre, correo, password } = req.body

  if (!nombre || !correo || !password) {
    return res.status(400).json({ error: 'Faltan campos requeridos' })
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
      },
      select: {
        id: true,
        nombre: true,
        correo: true,
        creadoEn: true,
      },
    })

    res.status(201).json({ mensaje: 'Usuario creado', usuario: nuevo })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export default permitirCors(handler)