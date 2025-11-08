// services/api/routes.ts
import apiClient from './config';
import { 
  ApiResponse, 
  Coordinates, 
  Route, 
  TransportSuggestion, 
  Weather,
  WeatherImpact 
} from '@/types/api';

interface GetRouteParams {
  from: Coordinates;
  to: Coordinates;
  mode?: 'driving' | 'walking';
  alternatives?: boolean;
  suggestions?: boolean;
  weather?: boolean;
}

interface RouteResponse {
  routes: Route[];
  suggestions?: TransportSuggestion[];
  weather?: {
    conditions: string;
    details: Weather;
    impact: WeatherImpact;
    advice: string[];
  };
  nearbyTransport?: any;
  metadata: any;
}

interface CompareRoutesParams {
  routes: Array<{
    from: Coordinates;
    to: Coordinates;
    name: string;
  }>;
  preferences?: {
    prioritizeSpeed?: boolean;
    considerWeather?: boolean;
    prioritizeCost?: boolean;
  };
}

interface OptimizeRouteParams {
  waypoints: Array<Coordinates & { name?: string }>;
  preferences?: {
    avoidTraffic?: boolean;
    considerWeather?: boolean;
  };
}

export const routesService = {
  /**
   * Calculer un itinéraire entre deux points
   */
  async getRoute(params: GetRouteParams): Promise<RouteResponse> {
    const queryParams = new URLSearchParams({
      from: `${params.from.lat},${params.from.lon}`,
      to: `${params.to.lat},${params.to.lon}`,
    });

    if (params.mode) queryParams.append('mode', params.mode);
    if (params.alternatives) queryParams.append('alternatives', 'true');
    if (params.suggestions !== false) queryParams.append('suggestions', 'true');
    if (params.weather !== false) queryParams.append('weather', 'true');

    const response = await apiClient.get<ApiResponse<RouteResponse>>(
      `/api/route?${queryParams.toString()}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Aucun itinéraire trouvé');
    }

    return response.data;
  },

  /**
   * Comparer plusieurs itinéraires
   */
  async compareRoutes(params: CompareRoutesParams) {
    const response = await apiClient.post<ApiResponse<any>>(
      '/api/route/compare',
      params
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Erreur de comparaison');
    }

    return response.data;
  },

  /**
   * Optimiser un itinéraire multi-points
   */
  async optimizeRoute(params: OptimizeRouteParams) {
    const response = await apiClient.post<ApiResponse<any>>(
      '/api/route/optimize',
      params
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Erreur d\'optimisation');
    }

    return response.data;
  },

  /**
   * Récupérer un itinéraire sauvegardé
   */
  async getSavedRoute(id: string, params?: {
    weather?: boolean;
    alternatives?: boolean;
  }) {
    const queryParams = new URLSearchParams();
    
    if (params?.weather !== false) queryParams.append('weather', 'true');
    if (params?.alternatives) queryParams.append('alternatives', 'true');

    const response = await apiClient.get<ApiResponse<any>>(
      `/api/route/${id}?${queryParams.toString()}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Itinéraire non trouvé');
    }

    return response.data;
  },
};