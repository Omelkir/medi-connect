import pool from '@/utils/connexion'

export const ajouter = async (req: any) => {
  try {
    const json: any = req

    await pool.query(`SELECT * From medi_connect.compte`)

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Erreur lors de l’enregistrement', error)
    return { erreur: true, message: 'Erreur lors de l’enregistrement' }
  }
}
