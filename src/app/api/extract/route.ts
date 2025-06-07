// src/app/api/extract/route.ts
import path from 'path'

import fs from 'fs'

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import pdf2text from 'pdf2text'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'test.pdf')

    // تأكد إذا الملف موجود
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Le fichier PDF n'existe pas" }, { status: 404 })
    }

    // استخراج النص
    const text = await new Promise<string>((resolve, reject) => {
      pdf2text(filePath, (err: any, data: string[]) => {
        if (err) reject(err)
        else resolve(data.join('\n'))
      })
    })

    return NextResponse.json({ text })
  } catch (error: any) {
    console.error("Erreur lors de l'extraction du PDF:", error)

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
