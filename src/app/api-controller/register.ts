import bcrypt from 'bcrypt'

import pool from '@/utils/connexion'

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

    const sql = `INSERT INTO medi_connect.medecin (nom_ut, email, mdp,role,image,tarif,id_ville,heurD,heurF,id_spe,info) 
                       VALUES ('${json.nom_ut}', '${json.email}', '${hashedPassword}','${json.role}', '${json.image}', '${json.tarif}', '${json.id_ville}', '${json.heurD}','${json.heurF}', '${json.id_spe}', '${json.info}')`

    await pool.query(sql)

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Erreur lors de l’enregistrement', error)

    return { erreur: true, message: 'Erreur lors de l’enregistrement' }
  }
}
