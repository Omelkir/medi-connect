import fs from 'fs'

import pdfParse from 'pdf-parse'
import formidable from 'formidable'

// Désactiver le body parser de Next.js
export const config = {
  api: {
    bodyParser: false
  }
}

export const pdfText = async (req: any) => {
  const form = new formidable.IncomingForm({ keepExtensions: true })

  return new Promise((resolve, reject) => {
    form.parse(req, async (err: any, fields: any, files: any) => {
      if (err) {
        console.error('Erreur parsing formidable', err)

        return resolve({
          erreur: true,
          message: 'Erreur lors du parsing du formulaire.'
        })
      }

      const file = files.data

      if (!file || Array.isArray(file)) {
        return resolve({
          erreur: true,
          message: 'Fichier PDF manquant ou invalide.'
        })
      }

      try {
        const buffer = fs.readFileSync(file.filepath)
        const data = await pdfParse(buffer)

        resolve({
          text: data.text?.trim() || 'Aucun texte trouvé.'
        })
      } catch (error) {
        console.error('Erreur lors du traitement du PDF', error)

        resolve({
          erreur: true,
          message: 'Erreur lors du traitement du PDF.'
        })
      }
    })
  })
}
