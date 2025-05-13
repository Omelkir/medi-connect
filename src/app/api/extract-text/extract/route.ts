import fs from 'fs'

import type { NextApiRequest, NextApiResponse } from 'next'
import pdfParse from 'pdf-parse'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const file = req.body

    try {
      // Créer un buffer à partir du fichier envoyé
      const buffer = Buffer.from(file.data)

      // Utiliser pdf-parse pour extraire le texte
      const data = await pdfParse(buffer)

      res.status(200).json({ text: data.text.trim() || 'Aucun texte trouvé.' })
    } catch (error) {
      console.error('Erreur lors du traitement du PDF', error)
      res.status(500).json({ error: "Erreur lors de l'extraction du texte" })
    }
  } else {
    res.status(405).json({ error: 'Méthode non autorisée' })
  }
}
