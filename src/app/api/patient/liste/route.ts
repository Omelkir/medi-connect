import { liste } from '@/app/api-controller/patient'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const data = await liste(req)

    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur lors du traitement de la requête', error)
    return NextResponse.json({ erreur: true, message: 'Erreur lors du traitement de la requête' }, { status: 500 })
  }
}
