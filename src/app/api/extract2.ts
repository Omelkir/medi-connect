// pages/api/pdf-to-text.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: {
    bodyParser: false // on désactive le bodyParser natif
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })

    return
  }

  try {
    // On va lire tout le body en buffer (fichier PDF brut)
    const chunks: Uint8Array[] = []

    // req est un ReadableStream, on récupère les chunks
    for await (const chunk of req) {
      chunks.push(chunk)
    }

    const buffer = Buffer.concat(chunks)

    // appel Cloudmersive API
    const response = await fetch('https://api.cloudmersive.com/pdf/convert/to/text', {
      method: 'POST',
      headers: {
        Apikey: '5ccc5aa9-376b-4697-9e74-2a1703c035b7',
        'Content-Type': 'application/pdf'
      },
      body: buffer
    })

    if (!response.ok) {
      const errorText = await response.text()

      res.status(response.status).json({ error: errorText })

      return
    }

    const text = await response.text()

    res.status(200).json({ text })
  } catch (error) {
    console.error('Erreur extraction PDF:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
