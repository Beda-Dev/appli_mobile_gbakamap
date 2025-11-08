// services/api/stops.ts
import apiClient from './config';
import { ApiResponse, Stop, TransportType } from '@/types/api';

interface GetStopsParams {
  lat: number;
  lon: number;
  radius?: number;
  type?: TransportType;
  limit?: number;
  refresh?: boolean;
}

interface GetStopsResponse {
  stops: Stop[];
  count: number;
  total: number;
  fromCache: boolean;
  radius: number;
}

interface UpdateStopData {
  name?: string;
  shelter?: boolean;
  bench?: boolean;
  wheelchair?: boolean;
}

export const stopsService = {
  /**
   * Rechercher des arrêts dans une zone géographique
   */
  async getStops(params: GetStopsParams): Promise<GetStopsResponse> {
    const queryParams = new URLSearchParams({
      lat: params.lat.toString(),
      lon: params.lon.toString(),
      radius: (params.radius || 2000).toString(),
      limit: (params.limit || 100).toString(),
    });

    if (params.type) {
      queryParams.append('type', params.type.toLowerCase());
    }

    if (params.refresh) {
      queryParams.append('refresh', 'true');
    }

    const response = await apiClient.get<ApiResponse<GetStopsResponse>>(
      `/api/stops?${queryParams.toString()}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Erreur lors de la récupération des arrêts');
    }

    return response.data;
  },

  /**
   * Obtenir les détails d'un arrêt spécifique
   */
  async getStopById(id: string): Promise<Stop> {
    const response = await apiClient.get<ApiResponse<Stop>>(
      `/api/stops/${id}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Arrêt non trouvé');
    }

    return response.data;
  },

  /**
   * Mettre à jour les informations d'un arrêt
   */
  async updateStop(id: string, data: UpdateStopData): Promise<Stop> {
    const response = await apiClient.patch<ApiResponse<Stop>>(
      `/api/stops/${id}`,
      data
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Erreur lors de la mise à jour');
    }

    return response.data;
  },

  /**
   * Recherche hybride avec clustering
   */
  async searchNearby(params: {
    lat: number;
    lon: number;
    q?: string;
    radius?: number;
    cluster?: boolean;
    zoom?: number;
    type?: string;
  }) {
    const queryParams = new URLSearchParams({
      lat: params.lat.toString(),
      lon: params.lon.toString(),
    });

    if (params.q) queryParams.append('q', params.q);
    if (params.radius) queryParams.append('radius', params.radius.toString());
    if (params.cluster) queryParams.append('cluster', 'true');
    if (params.zoom) queryParams.append('zoom', params.zoom.toString());
    if (params.type) queryParams.append('type', params.type);

    const response = await apiClient.get<ApiResponse<any>>(
      `/api/search/nearby?${queryParams.toString()}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Erreur de recherche');
    }

    return response.data;
  },
};