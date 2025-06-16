// backend/lib/cors.ts

import type { NextApiRequest, NextApiResponse } from 'next'

export function permitirCors(handler: Function) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001') // o "http://localhost:3001"
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Content-Type, Authorization'
    )

    if (req.method === 'OPTIONS') {
      res.status(200).end()
      return
    }

    return handler(req, res)
  }
}
