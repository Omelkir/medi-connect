import pool from '@/utils/connexion'
import bcrypt from 'bcrypt'

export const verifierUtilisateur = async (req: any) => {
  try {
    const { email, mdp } = req

    const sql = `SELECT *, 'utilisateur' AS type FROM medi_connect.utilisateur WHERE email = '${email}'
UNION
SELECT *, 'medecin' AS type FROM medi_connect.medecin WHERE email = '${email}'
UNION
SELECT *, 'laboratoire' AS type FROM medi_connect.laboratoire WHERE email = '${email}'
UNION
SELECT *, 'admin' AS type FROM medi_connect.admin WHERE email = '${email}'
LIMIT 1;`
    const [rows]: any = await pool.query(sql, [email])
    //console.log(rows)

    if (rows.length === 0) {
      return { erreur: true, message: 'Identifiants incorrects' }
    }

    const user = rows[0]

    const match = await bcrypt.compare(mdp, user.mdp)
    if (!match) {
      return { erreur: true, message: 'Identifiants incorrects' }
    }

    return { erreur: false, role: user.role }
  } catch (error) {
    console.error(error)
    return { erreur: true, message: 'Erreur serveur' }
  }
}
