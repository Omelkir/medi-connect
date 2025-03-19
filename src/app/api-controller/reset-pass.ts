import pool from '@/utils/connexion'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
export const reset = async (req: any) => {
  try {
    const json: any = req
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(json.mdp, saltRounds)
    await pool.query(`UPDATE medi_connect.compte SET mdp = '${hashedPassword}' where token='${json.token} '`)
    await pool.query(`UPDATE medi_connect.compte SET token = '' where token='${json.token} '`)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mediconnect048@gmail.com',
        pass: 'gteb fgrx puyt isrd'
      }
    })

    await transporter.sendMail({
      from: 'mediconnect048@gmail.com',
      to: json.to,
      subject: 'Demmande de réinitialisation mot de passe',
      html: `
          <p>Bonjour <strong>${json.to}</strong>,</p>
          <p>votre mail à été bien réinitialiser </p>
          
          <br/>
          <p>Cordialement,<br/>L'équipe de support</p>
        `
    })

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Erreur lors de l’enregistrement', error)
    return { erreur: true, message: 'Erreur lors de l’enregistrement' }
  }
}
