import { NextRequest, NextResponse } from 'next/server'

import type { RowDataPacket } from 'mysql2'

import pool from '@/utils/connexion'

export const liste = async (req: any) => {
  try {
    const { spe, nom_ut, ville } = req

    let sql = `SELECT 
  m.*, 
  COALESCE(AVG(s.pr) * 5 / 100, 0) AS sc
FROM medi_connect.medecin m
LEFT JOIN medi_connect.score s 
  ON s.id_el = m.id AND s.el = 2
 where 1 = 1 
`
    const params: any[] = []

    if (spe) {
      sql += ` AND m.spe = ?`
      params.push(spe)
    }

    if (nom_ut) {
      sql += ` AND m.nom_ut = ?`
      params.push(nom_ut)
    }

    if (ville) {
      sql += ` AND m.ville = ?`
      params.push(ville)
    }

    sql += ' GROUP BY m.id '
    const [rows] = await pool.query<RowDataPacket[]>(sql, params)

    // let totalCount = rows.length

    // let currentPage = parseInt(req.query.page as string) || 1
    // let itemsPerPage = parseInt(req.query.limit as string) || 6
    // let offset = (currentPage - 1) * itemsPerPage
    // let pi: any = {
    //   total: totalCount,
    //   currentPage: currentPage,
    //   count: rows.length,
    //   lastPage: Math.ceil(totalCount / itemsPerPage),
    //   firstItem: offset + 1,
    //   lastItem: offset + rows.length,
    //   perPage: itemsPerPage.toString(),
    //   firstPageUrl: `${process.env.BACK_HOST}/api/clients?search=&answer=null&limit=${itemsPerPage}&page=1`,
    //   lastPageUrl: `${process.env.BACK_HOST}/api/clients?search=&answer=null&limit=${itemsPerPage}&page=${Math.ceil(
    //     totalCount / itemsPerPage
    //   )}`,
    //   nextPageUrl:
    //     currentPage < Math.ceil(totalCount / itemsPerPage)
    //       ? `${process.env.BACK_HOST}/api/clients?search=&answer=null&limit=${itemsPerPage}&page=${currentPage + 1}`
    //       : null,
    //   prevPageUrl:
    //     currentPage > 1
    //       ? `${process.env.BACK_HOST}/api/clients?search=&answer=null&limit=${itemsPerPage}&page=${currentPage - 1}`
    //       : null
    // }

    return { erreur: false, data: rows }
  } catch (error) {
    console.error('Erreur SQL:', error)

    return { erreur: true, message: 'Erreur lors de la récupération des données' }
  }
}
