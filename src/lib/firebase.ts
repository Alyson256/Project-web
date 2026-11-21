/**
 * @deprecated [LEGADO - EM DESCONTINUAÇÃO]
 * Re-export transitório de autenticação.
 * A persistência oficial e autenticação serão migradas para a API Django + PostgreSQL.
 */
export {
  auth,
  firebaseApp,
  googleProvider,
  loginWithGoogle,
  logoutFromGoogle,
} from '../services/firebase';
