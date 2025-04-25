import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { liste } from '@/app/api-controller/liste-med-spe'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = await liste(body)

    if (!data) {
      return NextResponse.json({ erreur: true, message: 'Le paramètre "spe" est requis' }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error(error)

    return NextResponse.json({ erreur: true, message: 'Erreur interne du serveur' }, { status: 500 })
  }
}
