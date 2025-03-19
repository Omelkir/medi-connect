import pool from '@/utils/connexion'

export const ajouter = async (req: any) => {
  try {
    const json: any = req

    await pool.query(`INSERT INTO medi_connect.rendezvous (idMed,idLabo,nom, prenom, email, tel,date,heure) 
                       VALUES ('${json.idMed}','${json.idLabo}','${json.nom}', '${json.prenom}', '${json.email}', '${json.tel}', '${json.date}', '${json.heure}')`)

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Erreur lors de l’enregistrement', error)
    return { erreur: true, message: 'Erreur lors de l’enregistrement' }
  }
}
