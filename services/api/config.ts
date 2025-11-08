// services/api/config.ts
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'https://gbaka-maps.vercel.app';
const DEV_TOKEN = 'gbakamap-dev-token-2024';

class ApiClient {
  private client: AxiosInstance;
  private authToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config) => {
        // Ajouter le token d'authentification
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        } else {
          // Essayer de récupérer depuis le SecureStore
          const token = await SecureStore.getItemAsync('firebase_token');
          if (token) {
            this.authToken = token;
            config.headers.Authorization = `Bearer ${token}`;
          } else {
            // En dev, utiliser le token de test
            if (__DEV__) {
              config.headers.Authorization = `Bearer ${DEV_TOKEN}`;
            }
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expiré ou invalide
          await this.clearAuth();
          // Rediriger vers la page de connexion
          // EventEmitter.emit('auth:logout');
        }
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): Error {
    if (error.response) {
      // Erreur de réponse du serveur
      const data: any = error.response.data;
      return new Error(data?.error || 'Une erreur est survenue');
    } else if (error.request) {
      // Pas de réponse reçue
      return new Error('Impossible de contacter le serveur');
    } else {
      // Erreur de configuration
      return new Error(error.message || 'Une erreur est survenue');
    }
  }

  async setAuthToken(token: string) {
    this.authToken = token;
    await SecureStore.setItemAsync('firebase_token', token);
  }

  async clearAuth() {
    this.authToken = null;
    await SecureStore.deleteItemAsync('firebase_token');
  }

  // Méthodes HTTP
  async get<T>(url: string, config?: AxiosRequestConfig) {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig) {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
export default apiClient;