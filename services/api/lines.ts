// services/api/lines.ts
import apiClient from './config';
import { ApiResponse, TransportLine, TransportType } from '@/types/api';

interface GetLinesParams {
  type?: TransportType;
  active?: boolean;
  includeStops?: boolean;
}

interface CreateLineData {
  name: string;
  shortName?: string;
  color?: string;
  transportType: TransportType;
  operator?: string;
  fare?: number;
  routeRef?: string;
  stopIds?: string[];
}

export const linesService = {
  /**
   * Récupérer les lignes de transport
   */
  async getLines(params?: GetLinesParams): Promise<TransportLine[]> {
    const queryParams = new URLSearchParams();

    if (params?.type) {
      queryParams.append('type', params.type.toLowerCase());
    }
    if (params?.active !== undefined) {
      queryParams.append('active', params.active.toString());
    }
    if (params?.includeStops) {
      queryParams.append('includeStops', 'true');
    }

    const response = await apiClient.get<ApiResponse<{ lines: TransportLine[] }>>(
      `/api/lines?${queryParams.toString()}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Erreur lors de la récupération des lignes');
    }

    return response.data.lines;
  },

  /**
   * Créer une nouvelle ligne
   */
  async createLine(data: CreateLineData): Promise<TransportLine> {
    const response = await apiClient.post<ApiResponse<TransportLine>>(
      '/api/lines',
      data
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Erreur lors de la création de la ligne');
    }

    return response.data;
  },

  /**
   * Récupérer les lignes avec géométries complètes depuis Overpass
   */
  async getTransportLines(params: {
    north: number;
    south: number;
    east: number;
    west: number;
    types?: string[];
    format?: 'map' | 'api' | 'geojson';
    refresh?: boolean;
  }) {
    const queryParams = new URLSearchParams({
      north: params.north.toString(),
      south: params.south.toString(),
      east: params.east.toString(),
      west: params.west.toString(),
    });

    if (params.types) {
      queryParams.append('types', params.types.join(','));
    }
    if (params.format) {
      queryParams.append('format', params.format);
    }
    if (params.refresh) {
      queryParams.append('refresh', 'true');
    }

    const response = await apiClient.get<ApiResponse<any>>(
      `/api/transport-lines?${queryParams.toString()}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Erreur lors de la récupération');
    }

    return response.data;
  },
};