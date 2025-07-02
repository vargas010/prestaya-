import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { permitirCors } from '../../../lib/cors'
import { proteger } from '../../../lib/proteger'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const usuario = (req as any).usuario

  if (usuario.rol !== 'admin') {
    return res.status(403).json({ error: 'Solo los administradores pueden acceder' })
  }

  try {
    const totalUsuarios = await prisma.usuario.count()
    const totalPrestamos = await prisma.prestamo.count()
    const totalPagos = await prisma.pago.count()

    const totalPrestamosAprobados = await prisma.prestamo.count({
      where: { estado: 'aprobado' }
    })
    const totalPrestamosRechazados = await prisma.prestamo.count({
      where: { estado: 'rechazado' }
    })

    const montoPrestado = await prisma.prestamo.aggregate({
      _sum: { monto: true }
    })

    const montoPagado = await prisma.pago.aggregate({
      _sum: { monto: true }
    })

    return res.status(200).json({
      totalUsuarios,
      totalPrestamos,
      totalPrestamosAprobados,
      totalPrestamosRechazados,
      totalPagos,
      montoPrestado: montoPrestado._sum.monto || 0,
      montoPagado: montoPagado._sum.monto || 0
    })
  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export default permitirCors(proteger(handler))
