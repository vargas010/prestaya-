// backend/pages/api/prestamos/index.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { permitirCors } from '../../../lib/cors'
import { proteger } from '../../../lib/proteger'
import { parseForm } from '../../../lib/parseForm'
import type { File } from 'formidable'
import fs from 'fs'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET: Listar préstamos
  if (req.method === 'GET') {
    try {
      const prestamos = await prisma.prestamo.findMany({
        include: {
          usuario: {
            select: { correo: true }
          },
          archivos: true // 👈 importante para ver los archivos
        },
        orderBy: {
          creadoEn: 'desc'
        }
      })

      return res.status(200).json(prestamos)
    } catch (error) {
      console.error('❌ Error al obtener préstamos:', error)
      return res.status(500).json({ error: 'Error al obtener préstamos' })
    }
  }

  // POST: Crear préstamo con archivos
  if (req.method === 'POST') {
    const usuario = (req as any).usuario

    try {
      const { fields, files } = await parseForm(req)
      const montoRaw = Array.isArray(fields.monto) ? fields.monto[0] : fields.monto || ''
      const plazoRaw = Array.isArray(fields.plazo) ? fields.plazo[0] : fields.plazo || ''
      const motivoRaw = Array.isArray(fields.motivo) ? fields.motivo[0] : fields.motivo || ''
      const telefonoRaw = Array.isArray(fields.telefono) ? fields.telefono[0] : fields.telefono || ''

      const monto = parseFloat(montoRaw.toString())
      const plazo = parseInt(plazoRaw.toString())
      const motivo = motivoRaw.toString()
      const telefono = telefonoRaw.toString()

      if (!monto || !plazo || !motivo || !telefono) {
        return res.status(400).json({ error: 'Faltan campos' })
      }

      const prestamo = await prisma.prestamo.create({
        data: {
          monto,
          plazo,
          motivo,
          telefono,
          usuario: {
            connect: { id: usuario.id }
          }
        }
      })

      const carpeta = `uploads/usuario_${usuario.id}_${Date.now()}`
      fs.mkdirSync(carpeta, { recursive: true })

      const archivosRecibidos = Array.isArray(files.archivos)
        ? files.archivos
        : files.archivos ? [files.archivos] : []

      for (const file of archivosRecibidos) {
        const rutaDestino = `${carpeta}/${file.originalFilename}`
        fs.renameSync(file.filepath, rutaDestino)

        await prisma.archivoPrestamo.create({
          data: {
            url: `${carpeta.replace('uploads/', '')}/${file.originalFilename}`, // ✅ esta es la solución
            tipo: file.mimetype?.includes('image') ? 'imagen' : 'documento',
            prestamoId: prestamo.id
          }
        })
      }

      return res.status(201).json({ mensaje: 'Préstamo creado con archivos', prestamo })
    } catch (error) {
      console.error('❌ Error al crear préstamo:', error)
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  // PUT: Cambiar estado
  if (req.method === 'PUT') {
    const usuario = (req as any).usuario

    if (usuario.rol !== 'admin') {
      return res.status(403).json({ error: 'Solo administradores pueden cambiar el estado' })
    }

    let id: number | undefined
    let estado: string | undefined

    if (req.headers['content-type']?.includes('multipart/form-data')) {
      const { fields } = await parseForm(req)
      const idRaw = Array.isArray(fields.id) ? fields.id[0] : fields.id || ''
      const estadoRaw = Array.isArray(fields.estado) ? fields.estado[0] : fields.estado || ''

      id = parseInt(idRaw.toString())
      estado = estadoRaw.toString()
    } else {
      if (req.headers['content-type']?.includes('application/json')) {
        const buffers: Uint8Array[] = []
        for await (const chunk of req) {
          buffers.push(chunk)
        }
        const raw = Buffer.concat(buffers).toString()
        const json = JSON.parse(raw)
        id = json.id
        estado = json.estado
      } else {
        const { fields } = await parseForm(req)
        id = parseInt(Array.isArray(fields.id) ? fields.id[0] : fields.id || '')
        estado = Array.isArray(fields.estado) ? fields.estado[0] : fields.estado || ''
      }

    }

    if (!id || !estado || !['aprobado', 'rechazado'].includes(estado)) {
      return res.status(400).json({ error: 'Datos inválidos para actualizar' })
    }

    try {
      const prestamoActualizado = await prisma.prestamo.update({
        where: { id },
        data: { estado }
      })

      return res.status(200).json({ mensaje: 'Estado actualizado', prestamo: prestamoActualizado })
    } catch (error) {
      console.error('❌ Error al actualizar estado:', error)
      return res.status(500).json({ error: 'Error interno al actualizar préstamo' })
    }
  }

  return res.status(405).json({ error: 'Método no permitido' })
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default permitirCors(proteger(handler))
