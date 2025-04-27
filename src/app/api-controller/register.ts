import bcrypt from 'bcrypt'

import pool from '@/utils/connexion'

export const ajouter = async (req: any) => {
  try {
    const json: any = req
    let table = ''

    switch (json.role) {
      case 4:
        table = 'patient'

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

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(json.mdp, saltRounds)

    if (table === 'patient') {
      const sql = `INSERT INTO medi_connect.patient (nom, prenom, email, mdp, role, image, id_ville, isApproved, age, tel)
      VALUES ('${json.nom}', '${json.prenom}','${json.email}','${hashedPassword}',4, '${json.image}', '${json.id_ville}', 0,'${json.age}', '${json.tel}')`

      await pool.query(sql)
    } else if (table === 'medecin') {
      const sql = `INSERT INTO medi_connect.medecin (nom_ut, email, mdp, role, image, tarif, id_ville, heurD, heurF, id_spe, info, isApproved)
      VALUES ('${json.nom_ut}','${json.email}','${hashedPassword}',2, '${json.image}','${json.tarif}', '${json.id_ville}','${json.heurD}','${json.heurF}','${json.id_spe}', '${json.info}',0)`

      await pool.query(sql)
    } else if (table === 'laboratoire') {
      const sql = `INSERT INTO medi_connect.laboratoire (nom_ut, email, mdp, role, image, id_ville, heurD, heurF, id_ser, info, isApproved)
      VALUES ('${json.nom_ut}','${json.email}','${hashedPassword}',3, '${json.image}', '${json.id_ville}','${json.heurD}','${json.heurF}','${json.id_ser}', '${json.info}',0)`

      await pool.query(sql)
    }

    return { erreur: false, data: true }
  } catch (error) {
    console.error('Erreur lors de l’enregistrement', error)

    return { erreur: true, message: 'Erreur lors de l’enregistrement' }
  }
}
