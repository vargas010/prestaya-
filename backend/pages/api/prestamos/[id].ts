// backend/pages/api/prestamos/[id].ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { verificarToken } from '../../../lib/auth'
import { permitirCors } from '../../../lib/cors'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Token no enviado' })
  }

  try {
    const decoded: any = verificarToken(token)

    if (decoded.rol !== 'admin') {
      return res.status(403).json({ error: 'Solo los administradores pueden actualizar préstamos' })
    }

    const id = parseInt(req.query.id as string)
    const { estado } = req.body

    if (!['aprobado', 'rechazado'].includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' })
    }

    const prestamo = await prisma.prestamo.update({
      where: { id },
      data: { estado }
    })

    return res.status(200).json({ mensaje: 'Estado actualizado', prestamo })

  } catch (error) {
    console.error('❌ Error en PATCH /prestamos/:id', error)
    return res.status(500).json({ error: 'Error al actualizar préstamo' })
  }
}

export default permitirCors(handler)
