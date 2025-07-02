import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { permitirCors } from '../../../lib/cors'
import { proteger } from '../../../lib/proteger'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const usuario = (req as any).usuario

  if (req.method === 'GET') {
    try {
      const pagos = await prisma.pago.findMany({
        include: {
          prestamo: {
            select: {
              id: true,
              usuario: {
                select: { correo: true }
              }
            }
          }
        },
        orderBy: {
          fecha: 'desc'
        }
      })

      return res.status(200).json(pagos)
    } catch (error) {
      console.error('❌ Error al obtener pagos:', error)
      return res.status(500).json({ error: 'Error al obtener pagos' })
    }
  }

  if (req.method === 'POST') {
    if (usuario.rol !== 'admin') {
      return res.status(403).json({ error: 'Solo los administradores pueden registrar pagos' })
    }

    const { prestamoId, monto } = req.body

    if (!prestamoId || !monto) {
      return res.status(400).json({ error: 'Faltan datos para registrar el pago' })
    }

    try {
      const pago = await prisma.pago.create({
        data: {
          prestamoId: parseInt(prestamoId),
          monto: parseFloat(monto)
        }
      })

      return res.status(201).json({ mensaje: 'Pago registrado', pago })
    } catch (error) {
      console.error('❌ Error al registrar pago:', error)
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  return res.status(405).json({ error: 'Método no permitido' })
}

export default permitirCors(proteger(handler))
