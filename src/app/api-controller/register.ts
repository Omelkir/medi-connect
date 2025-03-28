import pool from '@/utils/connexion'
import bcrypt from 'bcrypt'

export const ajouter = async (req: any) => {
  try {
    const json: any = req
    let table = ''
    switch (json.role) {
      case 1:
        table = 'utilisateur'

        break
      case 2:
        table = 'medecin'

        break
      case 3:
        table = 'laboratoire'

        break

      default:
        table = ''
        break
    }
    const checkEmailSql = `SELECT * FROM medi_connect.${table} WHERE email = ?`
    const [emailExists]: any = await pool.query(checkEmailSql, [json.email])

    if (emailExists.length > 0) {
      return { erreur: true, message: "L'email est déjà utilisé." }
    }
    if (json.mdp !== json.conMdp) {
      return { erreur: true, message: 'Les mots de passe ne correspondent pas.' }
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(json.mdp, saltRounds)
    const saltRounds2 = 10
    const hashedConfPassword = await bcrypt.hash(json.conMdp, saltRounds2)

    const sql = `INSERT INTO medi_connect.${table} (nom_ut, email, mdp,conMdp, role,image,tarif,ville,horaires,service,spe,info) 
                       VALUES ('${json.nom_ut}', '${json.email}', '${hashedPassword}','${hashedConfPassword}', '${json.role}', '${json.image}', '${json.tarif}', '${json.ville}', '${json.horaires}', '${json.service}', '${json.spe}', '${json.info}')`
    await pool.query(sql)
    return { erreur: false, data: true }
  } catch (error) {
    console.error('Erreur lors de l’enregistrement', error)
    return { erreur: true, message: 'Erreur lors de l’enregistrement' }
  }
}
