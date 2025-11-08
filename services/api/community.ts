// services/api/community.ts
import apiClient from './config';
import { 
  ApiResponse, 
  Report, 
  ReportType, 
  ReportStatus,
  Favorite,
  SearchHistory 
} from '@/types/api';

interface CreateReportData {
  stopId?: string;
  reportType: ReportType;
  title: string;
  description?: string;
  imageUrl?: string;
  lat?: number;
  lon?: number;
}

interface GetReportsParams {
  status?: ReportStatus;
  stopId?: string;
  page?: number;
  limit?: number;
}

export const communityService = {
  /**
   * Créer un signalement
   */
  async createReport(data: CreateReportData): Promise<Report> {
    const response = await apiClient.post<ApiResponse<Report>>(
      '/api/reports',
      data
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Erreur lors de la création du signalement');
    }

    return response.data;
  },

  /**
   * Récupérer les signalements
   */
  async getReports(params?: GetReportsParams): Promise<{
    reports: Report[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const queryParams = new URLSearchParams();

    if (params?.status) queryParams.append('status', params.status);
    if (params?.stopId) queryParams.append('stopId', params.stopId);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await apiClient.get<ApiResponse<any>>(
      `/api/reports?${queryParams.toString()}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Erreur lors de la récupération');
    }

    return response.data;
  },

  /**
   * Ajouter aux favoris
   */
  async addFavorite(stopId: string): Promise<Favorite> {
    const response = await apiClient.post<ApiResponse<Favorite>>(
      '/api/favorites',
      { stopId }
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Erreur lors de l\'ajout');
    }

    return response.data;
  },

  /**
   * Récupérer les favoris
   */
  async getFavorites(): Promise<Favorite[]> {
    const response = await apiClient.get<ApiResponse<Favorite[]>>(
      '/api/favorites'
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Erreur lors de la récupération');
    }

    return response.data;
  },

  /**
   * Retirer des favoris
   */
  async removeFavorite(stopId: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse<any>>(
      `/api/favorites/${stopId}`
    );

    if (!response.success) {
      throw new Error(response.error || 'Erreur lors de la suppression');
    }
  },

  /**
   * Vérifier si un arrêt est en favoris
   */
  async isFavorite(stopId: string): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      return favorites.some(fav => fav.stopId === stopId);
    } catch {
      return false;
    }
  },

  /**
   * Ajouter à l'historique
   */
  async addToHistory(data: {
    query: string;
    fromLat: number;
    fromLon: number;
    toLat: number;
    toLon: number;
  }): Promise<SearchHistory> {
    const response = await apiClient.post<ApiResponse<SearchHistory>>(
      '/api/history',
      data
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Erreur lors de l\'enregistrement');
    }

    return response.data;
  },
};