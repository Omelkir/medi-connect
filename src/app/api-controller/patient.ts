import bcrypt from 'bcrypt'

import pool from '@/utils/connexion'

export const ajouter = async (req: any) => {
  try {
    const json: any = req
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash('0000', saltRounds)

    const sql = `INSERT INTO medi_connect.patient (nom,prenom, email, mdp, role,image,tarif,ville,horaires,service,spe,info,id_med) 
                       VALUES ('${json.nom}','${json.prenom}', '${json.email}', '${hashedPassword}', '${json.role}', '${json.image}', '${json.tarif}', '${json.ville}', '${json.horaires}', '${json.service}', '${json.spe}', '${json.info}', '${json.id_med}')`

    await pool.query(sql)

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

  // Convertir les paramètres en un objet JSON
  const paramsObj = Object.fromEntries(urlParams.entries())
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
    const json: any = req
    const id = json.id
    const sql = `UPDATE medi_connect.patient SET nom ='${json.nom}',prenom ='${json.prenom}',email ='${json.email}',tel='${json.tel}' where id='${id}'`

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
