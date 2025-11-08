// services/firebase/auth.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
} from 'firebase/auth';
import { auth } from './config';
import apiClient from '../api/config';

export interface AuthError {
  code: string;
  message: string;
}

export interface SignUpData {
  email: string;
  password: string;
  displayName: string;
}

export interface SignInData {
  email: string;
  password: string;
}

class AuthService {
  /**
   * Inscription avec email et mot de passe
   */
  async signUp({ email, password, displayName }: SignUpData): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Mettre à jour le profil avec le nom
      await updateProfile(userCredential.user, {
        displayName,
      });

      // Sauvegarder le token dans l'API client
      const token = await userCredential.user.getIdToken();
      await apiClient.setAuthToken(token);

      return userCredential.user;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Connexion avec email et mot de passe
   */
  async signIn({ email, password }: SignInData): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Sauvegarder le token
      const token = await userCredential.user.getIdToken();
      await apiClient.setAuthToken(token);

      return userCredential.user;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Déconnexion
   */
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
      await apiClient.clearAuth();
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Réinitialisation du mot de passe
   */
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Mettre à jour le profil
   */
  async updateUserProfile(updates: {
    displayName?: string;
    photoURL?: string;
  }): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Aucun utilisateur connecté');

      await updateProfile(user, updates);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Mettre à jour l'email
   */
  async updateUserEmail(newEmail: string, currentPassword: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) throw new Error('Aucun utilisateur connecté');

      // Réauthentifier avant de changer l'email
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      await updateEmail(user, newEmail);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Mettre à jour le mot de passe
   */
  async updateUserPassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) throw new Error('Aucun utilisateur connecté');

      // Réauthentifier avant de changer le mot de passe
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Supprimer le compte
   */
  async deleteAccount(password: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) throw new Error('Aucun utilisateur connecté');

      // Réauthentifier avant de supprimer
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      await deleteUser(user);
      await apiClient.clearAuth();
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Obtenir le token ID actuel
   */
  async getCurrentToken(): Promise<string | null> {
    try {
      const user = auth.currentUser;
      if (!user) return null;
      return await user.getIdToken();
    } catch (error) {
      return null;
    }
  }

  /**
   * Rafraîchir le token
   */
  async refreshToken(): Promise<string | null> {
    try {
      const user = auth.currentUser;
      if (!user) return null;
      const token = await user.getIdToken(true); // force refresh
      await apiClient.setAuthToken(token);
      return token;
    } catch (error) {
      return null;
    }
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isAuthenticated(): boolean {
    return auth.currentUser !== null;
  }

  /**
   * Obtenir l'utilisateur actuel
   */
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  /**
   * Gérer les erreurs Firebase
   */
  private handleAuthError(error: any): Error {
    const errorMessages: { [key: string]: string } = {
      'auth/email-already-in-use': 'Cet email est déjà utilisé',
      'auth/invalid-email': 'Email invalide',
      'auth/operation-not-allowed': 'Opération non autorisée',
      'auth/weak-password': 'Mot de passe trop faible (minimum 6 caractères)',
      'auth/user-disabled': 'Ce compte a été désactivé',
      'auth/user-not-found': 'Aucun compte trouvé avec cet email',
      'auth/wrong-password': 'Mot de passe incorrect',
      'auth/invalid-credential': 'Identifiants invalides',
      'auth/too-many-requests': 'Trop de tentatives. Réessayez plus tard',
      'auth/network-request-failed': 'Erreur réseau. Vérifiez votre connexion',
      'auth/requires-recent-login': 'Cette action nécessite une reconnexion',
    };

    const message = errorMessages[error.code] || error.message || 'Une erreur est survenue';
    return new Error(message);
  }
}

export const authService = new AuthService();
export default authService;