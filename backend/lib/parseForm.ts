import { IncomingForm, Fields, Files } from 'formidable'
import type { NextApiRequest } from 'next'
import fs from 'fs'

export function parseForm(req: NextApiRequest): Promise<{ fields: Fields, files: Files }> {
  const form = new IncomingForm({
    multiples: true,
    uploadDir: './uploads',
    keepExtensions: true,
  })

  if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads')
  }

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)
      resolve({ fields, files })
    })
  })
}
