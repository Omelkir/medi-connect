import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'

import pool from '@/utils/connexion'

function genererMotDePasse(): string {
  const lettres = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const chiffres = '0123456789'
  const caracteresSpeciaux = '&#'
  const tous = lettres + chiffres + caracteresSpeciaux

  let motDePasse = ''

  motDePasse += lettres[Math.floor(Math.random() * lettres.length)]
  motDePasse += chiffres[Math.floor(Math.random() * chiffres.length)]
  motDePasse += caracteresSpeciaux[Math.floor(Math.random() * caracteresSpeciaux.length)]

  // Ajouter les caractères restants (au total 10)
  for (let i = 3; i < 10; i++) {
    motDePasse += tous[Math.floor(Math.random() * tous.length)]
  }

  // Mélanger les caractères
  return motDePasse
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('')
}

export const ajouter = async (req: any) => {
  try {
    const json: any = req
    const { email, nom_ut } = json

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mediconnect048@gmail.com',
        pass: 'viau pxiq ietj gmoj'
      }
    })

    const motDePasse = genererMotDePasse()

    console.log('mdp:', motDePasse)
    const hashedPassword = await bcrypt.hash(motDePasse, 10)

    const sql = `INSERT INTO medi_connect.admin (nom_ut, email, mdp,role,image) 
                       VALUES ('${json.nom_ut}', '${json.email}', '${hashedPassword}',1, '${json.image}')`

    await pool.query(sql)

    const mailOptions = {
      from: '"MediConnect" <mediconnect048@gmail.com>',
      to: email,
      subject: 'Bienvenue sur MediConnect',
      html: `
          <p>Bonjour <strong>${nom_ut}</strong>,</p>
<p>Bienvenue sur <strong>MediConnect</strong> !</p>
<p>Votre compte admin a été créé avec succès. Voici vos identifiants temporaires :</p>
<ul>
  <li><strong>Email :</strong> ${email}</li>
  <li><strong>Mot de passe :</strong> ${motDePasse}</li>
</ul>
<p>Nous vous recommandons de modifier votre mot de passe lors de votre première connexion.</p>
<br/>
<p>Nous sommes heureux de vous accueillir sur notre plateforme.</p>
<p>Cordialement,<br>L'équipe MediConnect</p>
        `
    }

    await transporter.sendMail(mailOptions)

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Erreur lors de l’enregistrement', error)

    return { erreur: true, message: 'Erreur lors de l’enregistrement' }
  }
}

export const liste = async (req: any) => {
  try {
    const json: any = req

    const totalCountQuery = `SELECT COUNT(*) as count FROM medi_connect.admin`

    const totalCountResult: any = await pool.query(totalCountQuery)
    const totalCount = totalCountResult[0][0].count

    // const currentPage = parseInt(req.query.page as string) || 1
    // const itemsPerPage = parseInt(req.query.limit as string) || 6
    const currentPage = 1
    const itemsPerPage = 6
    const offset = (currentPage - 1) * itemsPerPage

    const sql = `
    SELECT *
    FROM admin
  `

    const [rows] = await pool.query(sql)
    const data: any = rows

    const pi: any = {
      total: totalCount,
      currentPage: currentPage,
      count: data.length,
      lastPage: Math.ceil(totalCount / itemsPerPage),
      firstItem: offset + 1,
      lastItem: offset + data.length,
      perPage: itemsPerPage.toString(),
      firstPageUrl: `/api/admin/liste?limit=${itemsPerPage}&page=1`,
      lastPageUrl: `/api/admin/liste?limit=${itemsPerPage}&page=${Math.ceil(totalCount / itemsPerPage)}`,
      nextPageUrl:
        currentPage < Math.ceil(totalCount / itemsPerPage)
          ? `/api/admin/liste?limit=${itemsPerPage}&page=${currentPage + 1}`
          : null,
      prevPageUrl: currentPage > 1 ? `/api/admin/liste?limit=${itemsPerPage}&page=${currentPage - 1}` : null
    }

    return { erreur: false, data: data, paginatorInfo: pi }
  } catch (error) {
    console.error('Erreur lors de la récupération des admins:', error)

    return { erreur: true, message: 'Erreur lors de l’enregistrement' }
  }
}

export const modifier = async (req: any) => {
  try {
    const json: any = req
    const id = json.id
    const sql = `UPDATE medi_connect.admin SET nom_ut ='${json.nom_ut}',email ='${json.email}',image='${json.image}' where id='${id}'`

    await pool.query(sql)

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Erreur lors de l’enregistrement', error)

    return { erreur: true, message: 'Erreur lors de l’enregistrement' }
  }
}

export const supprimer = async (req: any) => {
  try {
    const id = req.params.id

    if (!id) {
      return { erreur: true, message: 'ID is required' }
    }

    const sql = `DELETE FROM medi_connect.admin WHERE id='${id}'`
    const result: any = await pool.query(sql, [id])

    console.log(sql)

    if (result.affectedRows === 0) {
      return { erreur: true, message: 'admin non trouvé' }
    }

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Error deleting:', error)

    return { erreur: true, message: 'Erreur lors de la suppression' }
  }
}
