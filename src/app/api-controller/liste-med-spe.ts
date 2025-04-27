import type { RowDataPacket } from 'mysql2'

import pool from '@/utils/connexion'

export const liste = async (req: any) => {
  try {
    const { spe, nom_ut, ville } = req.query

    let sql = `SELECT 
  m.*, 
  COALESCE(AVG(s.pr) * 5 / 100, 0) AS sc
FROM medi_connect.medecin m
LEFT JOIN medi_connect.score s 
  ON s.id_el = m.id AND s.el = 2
 where 1 = 1 
`
    const params: any[] = []

    const filters = {
      'm.spe': spe,
      'm.nom_ut': nom_ut,
      'm.ville': ville
    }

    for (const [column, value] of Object.entries(filters)) {
      if (value) {
        sql += ` AND ${column} = ?`
        params.push(value)
      }
    }

    sql += ' GROUP BY m.id '
    const [rows] = await pool.query<RowDataPacket[]>(sql, params)

    return { erreur: false, data: rows }
  } catch (error) {
    console.error('Erreur SQL:', error)

    return { erreur: true, message: 'Erreur lors de la récupération des données' }
  }
}
