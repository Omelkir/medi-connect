import pool from '@/utils/connexion'
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { MdToken } from 'react-icons/md'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { to, subject, text } = body
  let token: any = crypto.randomUUID()
  const slq = await pool.query(`UPDATE medi_connect.compte SET token = '${token}' where email='${to}'`)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mediconnect048@gmail.com',
      pass: 'gteb fgrx puyt isrd'
    }
  })

  try {
    await transporter.sendMail({
      from: 'mediconnect048@gmail.com',
      to,
      subject: 'Demmande de réinitialisation mot de passe',
      html: `
      <p>Bonjour <strong>${to}</strong>,</p>
      <p>Veuillez cliquer sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
      <p>
        <a href="http://localhost:3000/reset-password?token=${token}&to=${to}" style="color: #007bff; text-decoration: none; font-weight: bold;">
          Réinitialiser mon mot de passe
        </a>
      </p>
      <p>Si vous n'avez pas demandé de réinitialisation, ignorez cet email.</p>
      <br/>
      <p>Cordialement,<br/>L'équipe de support</p>
    `
    })

    return NextResponse.json({ erreur: false, message: 'Mail sent successfully' })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json({ erreur: true, message: 'Failed to send mail' }, { status: 500 })
  }
}
