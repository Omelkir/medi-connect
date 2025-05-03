import pool from '@/utils/connexion'

export const updateApproval = async (body: any) => {
  try {
    const { id } = body

    if (!id) {
      return { erreur: true, message: 'Paramètres invalides' }
    }

    const sql = `
      UPDATE medi_connect.medecin
      SET isApproved =1
      WHERE id = ${id}
    `

    await pool.query(sql, [id])

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l’approbation', error)

    return { erreur: true, message: 'Erreur lors de la mise à jour' }
  }
}
