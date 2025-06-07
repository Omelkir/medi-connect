import fs from 'fs/promises'
import path from 'path'

import type { NextApiRequest, NextApiResponse } from 'next'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const filePath = path.join(process.cwd(), 'public', 'test.pdf')
    const data = await fs.readFile(filePath)

    // Load PDF document
    const loadingTask = pdfjsLib.getDocument({ data })
    const pdfDocument = await loadingTask.promise

    let fullText = ''

    // Loop over all pages and extract text
    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i)
      const textContent = await page.getTextContent()

      // Concatenate all text items of the page
      const pageText = textContent.items.map((item: any) => item.str).join(' ')

      fullText += pageText + '\n'
    }

    return res.status(200).json({ text: fullText })
  } catch (error) {
    console.error(error)

    return res.status(500).json({ error: 'Failed to parse PDF' })
  }
}
