import { mkdir, writeFile } from 'fs/promises'

import path from 'path'

import fs from 'fs'

import { v4 as uuidv4 } from 'uuid'

import nodemailer from 'nodemailer'
import bcrypt from 'bcrypt'

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
    const formData = await req.formData()
    const file = formData.get('image') as File

    req.checkUrl = ''

    if (file) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const uploadDir = path.join(process.cwd(), 'public', 'uploads')

      if (!fs.existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true })
      }

      const filename = `${uuidv4()}_${file.name}`
      const filepath = path.join(uploadDir, filename)

      req.checkUrl = '/uploads/' + filename
      await writeFile(filepath, buffer)
    }

    const json: Record<string, any> = {}

    formData.forEach((value: any, key: any) => {
      json[key] = value
    })
    const { email, nom, prenom } = json

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mediconnect048@gmail.com',
        pass: 'viau pxiq ietj gmoj'
      }
    })

    let motDePasse
    let hashedPassword

    if (json.id_el == 1) {
      motDePasse = genererMotDePasse()
      hashedPassword = await bcrypt.hash(motDePasse, 10)
    } else {
      motDePasse = null
      hashedPassword = json.mdp
    }

    const sql = `
    INSERT INTO medi_connect.patient (
      nom, prenom, email, mdp, role, image, id_ville, isApproved, id_el, age, tel
    ) VALUES (
      '${json.nom}',
      '${json.prenom}',
      '${json.email}',
      '${hashedPassword}',
      '4',
      '${req.checkUrl}',
      '${json.id_ville}',
      '${json.isApproved}',
      '${json.id_el}',
      '${json.age}',
      '${json.tel}'
    )
  `

    await pool.query(sql)

    if (json.id_el == 1) {
      const mailOptions = {
        from: '"MediConnect" <mediconnect048@gmail.com>',
        to: email,
        subject: 'Bienvenue sur MediConnect',
        html: `
          <p>Bonjour <strong>${prenom + ' '}${nom}</strong>,</p>
          <p>Bienvenue sur <strong>MediConnect</strong> !</p>
          <p>Votre compte a été créé avec succès. Voici vos identifiants temporaires :</p>
          <ul>
            <li><strong>Email :</strong> ${email}</li>
            <li><strong>Mot de passe :</strong> ${motDePasse}</li>
          </ul>
          <p>Nous vous recommandons de changer votre mot de passe après votre première connexion.</p>
          <br/>
          <p>Nous sommes ravis de vous compter parmi nous.</p>
          <p>Cordialement,<br>L'équipe MediConnect</p>
        `
      }

      await transporter.sendMail(mailOptions)
    }

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Erreur lors de l’enregistrement', error)

    return { erreur: true, message: 'Erreur lors de l’enregistrement' }
  }
}

export const liste = async (req: any) => {
  // try {
  const json: any = req
  const urlParams = new URLSearchParams(new URL(json.url).search)

  console.log('urlParams:', urlParams)

  // Convertir les paramètres en un objet JSON
  const paramsObj = Object.fromEntries(urlParams.entries())

  console.log('paramsObj:', paramsObj)
  let whereClause = ''
  let currentPage = 1
  let itemsPerPage = 6

  Object.keys(paramsObj).forEach((key, index) => {
    if (paramsObj[key] && ['page', 'limit'].indexOf(key) === -1) {
      // Ajoute la condition WHERE
      if (index === 0) {
        whereClause += ` WHERE ${key} = ${paramsObj[key]}`
      } else {
        whereClause += ` AND ${key} = ${paramsObj[key]}`
      }
    }

    if (key === 'page') {
      currentPage = parseInt(paramsObj[key] as string)
    }

    if (key === 'limit') {
      itemsPerPage = parseInt(paramsObj[key] as string)
    }
  })
  const totalCountQuery = `SELECT COUNT(*) as count FROM medi_connect.patient ${whereClause}`

  const totalCountResult: any = await pool.query(totalCountQuery)

  const totalCount = totalCountResult[0][0].count

  const offset = (currentPage - 1) * itemsPerPage

  const sql = `SELECT p.*, v.ville AS ville FROM patient p LEFT JOIN ville v ON p.id_ville = v.id ${whereClause} LIMIT
        ${itemsPerPage}
    OFFSET
        ${offset}`

  console.log(sql)

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
    firstPageUrl: `/api/patient/liste?limit=${itemsPerPage}&page=1`,
    lastPageUrl: `/api/patient/liste?limit=${itemsPerPage}&page=${Math.ceil(totalCount / itemsPerPage)}`,
    nextPageUrl:
      currentPage < Math.ceil(totalCount / itemsPerPage)
        ? `/api/patient/liste?limit=${itemsPerPage}&page=${currentPage + 1}`
        : null,
    prevPageUrl: currentPage > 1 ? `/api/patient/liste?limit=${itemsPerPage}&page=${currentPage - 1}` : null
  }

  return { erreur: false, data: data, paginatorInfo: pi }

  // } catch (error) {
  //   console.error('Erreur lors de la récupération des patients:', error)

  //   return { erreur: true, message: 'Erreur lors de l’enregistrement' }
  // }
}

export const modifier = async (req: any) => {
  try {
    const formData = await req.formData()
    const json: Record<string, any> = {}

    formData.forEach((value: any, key: any) => {
      json[key] = value
    })
    const id = json.id
    const sql = `UPDATE medi_connect.patient SET nom ='${json.nom}',prenom ='${json.prenom}',email ='${json.email}',tel='${json.tel}',age='${json.age}',id_ville='${json.id_ville}' where id='${id}'`

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

    const sql = `DELETE FROM medi_connect.patient WHERE id='${id}'`
    const result: any = await pool.query(sql, [id])

    console.log(sql)

    if (result.affectedRows === 0) {
      return { erreur: true, message: 'Patient non trouvé' }
    }

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Error deleting:', error)

    return { erreur: true, message: 'Erreur lors de la suppression' }
  }
}
