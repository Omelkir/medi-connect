import pool from '@/utils/connexion'

export const ajouter = async (req: any) => {
  try {
    const json: any = req

    await pool.query(`INSERT INTO medi_connect.consultation (id_el,el,date,id_patient, isApproved, duree) 
                       VALUES ('${json.id_el}','${json.el}','${json.date}', '${json.id_patient}', 0, '${json.duree}')`)

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Erreur lors de l’enregistrement', error)

    return { erreur: true, message: 'Erreur lors de l’enregistrement' }
  }
}
