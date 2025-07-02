import { join } from 'path'
import { existsSync, createReadStream } from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.query

  if (!Array.isArray(path)) {
    return res.status(400).send('Ruta inválida')
  }

  const filePath = join(process.cwd(), 'uploads', ...path)
  if (!existsSync(filePath)) {
    return res.status(404).send('Archivo no encontrado')
  }

  const stream = createReadStream(filePath)
  stream.pipe(res)
}
