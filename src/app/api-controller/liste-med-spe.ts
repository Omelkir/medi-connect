import pool from '@/utils/connexion'
import { RowDataPacket } from 'mysql2'
import { NextRequest, NextResponse } from 'next/server'
export const liste = async (req: any) => {
  try {
    const { spe, nom_ut, ville } = req

    let sql = `SELECT *
               FROM medi_connect.compte
               WHERE 1=1 and role=2`
    const params: any[] = []

    if (spe) {
      sql += ` AND spe = ?`
      params.push(spe)
    }
    if (nom_ut) {
      sql += ` AND nom_ut = ?`
      params.push(nom_ut)
    }
    if (ville) {
      sql += ` AND ville = ?`
      params.push(ville)
    }
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
