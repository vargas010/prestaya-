// pages/api/usuarios/[id].ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { requiereAuth } from '../../../lib/middlewareAuth'
import { permitirCors } from '../../../lib/cors'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req
  const { id } = req.query

  switch (method) {
    case 'PUT':
      const { nombre, correo, rol } = req.body

      if (!nombre || !correo || !rol) {
        return res.status(400).json({ error: 'Datos incompletos' })
      }

      try {
        const actualizado = await prisma.usuario.update({
          where: { id: Number(id) },
          data: { nombre, correo, rol }
        })
        return res.status(200).json(actualizado)
      } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'Error al actualizar usuario' })
      }

    case 'DELETE':
      try {
        await prisma.usuario.delete({
          where: { id: Number(id) }
        })
        return res.status(204).end()
      } catch (err) {
        return res.status(500).json({ error: 'Error al eliminar usuario' })
      }

    default:
      res.setHeader('Allow', ['PUT', 'DELETE'])
      return res.status(405).end(`Método ${method} no permitido`)
  }
}

export default permitirCors(requiereAuth(handler))
