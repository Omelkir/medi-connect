import { liste } from '@/app/api-controller/liste-labo-ser'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = await liste(body)

    if (!data) {
      return NextResponse.json({ erreur: true, message: 'Le paramètre "service" est requis' }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ erreur: true, message: 'Erreur interne du serveur' }, { status: 500 })
  }
}
