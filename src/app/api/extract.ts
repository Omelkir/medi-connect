// pages/api/extract.ts

import fs from 'fs'

import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import pdfParse from 'pdf-parse'

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const form = new formidable.IncomingForm({ keepExtensions: true })

  form.parse(req, async (err: any, fields: any, files: any) => {
    if (err) {
      console.error('Erreur parsing formidable', err)

      return res.status(500).json({ erreur: true, message: 'Erreur parsing.' })
    }

    const file = files.data

    if (!file || Array.isArray(file)) {
      return res.status(400).json({ erreur: true, message: 'Fichier manquant ou invalide.' })
    }

    try {
      const buffer = fs.readFileSync(file.filepath)
      const data = await pdfParse(buffer)

      return res.status(200).json({ text: data.text?.trim() || 'Aucun texte trouvé.' })
    } catch (error) {
      console.error('Erreur PDF', error)

      return res.status(500).json({ erreur: true, message: 'Erreur traitement PDF.' })
    }
  })
}
