import pool from '@/utils/connexion'
import bcrypt from 'bcrypt'

export const verifierUtilisateur = async (req: any) => {
  try {
    const { email, mdp } = req

    //     const sql = `SELECT id,nom,prenom,email,mdp,image,role,'' as spe ,'' as service, 'patient' AS type FROM medi_connect.patient WHERE email = '${email}'
    // UNION
    // SELECT id,nom_ut,email,mdp,image,role,spe,'' as service, 'medecin' AS type FROM medi_connect.medecin WHERE email = '${email}'
    // UNION
    // SELECT id,nom_ut,email,mdp,image,role,service, '' as spe,'laboratoire' AS type FROM medi_connect.laboratoire WHERE email = '${email}'
    // UNION
    // SELECT id,nom_ut,mdp,email,image,role,'' as spe,'' as service, 'admin' AS type FROM medi_connect.admin WHERE email = '${email}'
    // LIMIT 1;`
    const sql = `
  SELECT id, nom, prenom, email, mdp, image, role, '' AS id_spe, '' AS service, 'patient' AS type 
  FROM medi_connect.patient 
  WHERE email = '${email}'
  
  UNION
  
  SELECT id, nom_ut AS nom, '' AS prenom, email, mdp, image, role, id_spe, '' AS service, 'medecin' AS type 
  FROM medi_connect.medecin 
  WHERE email = '${email}'

  UNION
  
  SELECT id, nom_ut AS nom, '' AS prenom, email, mdp, image, role, '' AS id_spe, service, 'laboratoire' AS type 
  FROM medi_connect.laboratoire 
  WHERE email = '${email}'

  UNION
  
  SELECT id, nom_ut AS nom, '' AS prenom, email, mdp, image, role, id_spe, service, 'admin' AS type 
  FROM medi_connect.admin 
  WHERE email = '${email}'

  LIMIT 1;
`

    const [rows]: any = await pool.query(sql, [email])
    //console.log(rows)

    if (rows.length === 0) {
      return { erreur: true, message: 'Identifiants incorrects' }
    }

    let user = rows[0]

    if (user.role === 1) {
      // Ne pas utiliser bcrypt pour les admins
      if (mdp !== user.mdp) {
        return { erreur: true, message: 'Identifiants incorrects' }
      }
    } else {
      // Utiliser bcrypt pour les autres (patients, médecins, labos)
      const match = await bcrypt.compare(mdp, user.mdp)
      if (!match) {
        return { erreur: true, message: 'Identifiants incorrects' }
      }
    }
    delete user.mdp

    return { erreur: false, role: user.role, user }
  } catch (error) {
    console.error(error)
    return { erreur: true, message: 'Erreur serveur' }
  }
}
