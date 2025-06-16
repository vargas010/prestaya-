// pages/api/usuarios/index.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import bcrypt from 'bcrypt'
import { permitirCors } from '../../../lib/cors'
import { requiereAuth } from '../../../lib/middlewareAuth'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        await requiereAuth(req, res) // protegemos esta ruta
        const usuarios = await prisma.usuario.findMany({
          select: {
            id: true,
            nombre: true,
            correo: true,
            creadoEn: true,
          }
        })
        res.status(200).json(usuarios)
      } catch (error) {
        res.status(401).json({ error: 'Token inválido (usuarios GET)' })
      }
      break

    case 'POST':
      const { nombre, correo, password, rol = 'usuario' } = req.body

      if (!nombre || !correo || !password) {
        return res.status(400).json({ error: 'Faltan datos' })
      }

      try {
        const passwordHasheado = await bcrypt.hash(password, 10)
        const nuevoUsuario = await prisma.usuario.create({
          data: {
            nombre,
            correo,
            password: passwordHasheado,
            rol
          },
        })
        res.status(201).json(nuevoUsuario)
      } catch (error) {
        res.status(500).json({ error: 'Error al crear usuario' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Método ${method} no permitido`)
  }
}

export default permitirCors(handler)
