// services/api/weather.ts
import apiClient from './config';
import { ApiResponse, Weather } from '@/types/api';

interface WeatherParams {
  q?: string;
  lat?: number;
  lon?: number;
  type?: 'current' | 'forecast';
}

interface WeatherResponse {
  location: {
    name: string;
    country: string;
    coord: {
      lat: number;
      lon: number;
    };
  };
  current: Weather;
  wind: {
    speed: number;
    direction: number;
  };
  clouds: number;
  sun: {
    sunrise: number;
    sunset: number;
  };
  timestamp: number;
  transportAdvice: string[];
}

interface ForecastParams {
  q?: string;
  lat?: number;
  lon?: number;
  hours?: number;
  transport?: boolean;
}

interface ForecastHour {
  datetime: string;
  timestamp: number;
  hour: number;
  temp: number;
  feels_like: number;
  temp_range: {
    min: number;
    max: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  };
  conditions: {
    humidity: number;
    pressure: number;
    clouds: number;
    wind: {
      speed: number;
      direction: number;
    };
    visibility: number;
    rain_probability: number;
    rain_amount: number;
  };
  transportSuitability?: {
    walking: {
      score: number;
      advice: string[];
    };
    moto_taxi: {
      score: number;
      advice: string[];
    };
    open_transport: {
      score: number;
      advice: string[];
    };
    covered_transport: {
      score: number;
      advice: string[];
    };
  };
}

export const weatherService = {
  /**
   * Obtenir les conditions météo actuelles
   */
  async getCurrent(params: WeatherParams): Promise<WeatherResponse> {
    const queryParams = new URLSearchParams();

    if (params.q) {
      queryParams.append('q', params.q);
    } else if (params.lat && params.lon) {
      queryParams.append('lat', params.lat.toString());
      queryParams.append('lon', params.lon.toString());
    } else {
      throw new Error('Ville ou coordonnées requises');
    }

    queryParams.append('type', 'current');

    const response = await apiClient.get<ApiResponse<WeatherResponse>>(
      `/api/weather?${queryParams.toString()}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Erreur météo');
    }

    return response.data;
  },

  /**
   * Obtenir les prévisions météo
   */
  async getForecast(params: ForecastParams) {
    const queryParams = new URLSearchParams();

    if (params.q) {
      queryParams.append('q', params.q);
    } else if (params.lat && params.lon) {
      queryParams.append('lat', params.lat.toString());
      queryParams.append('lon', params.lon.toString());
    } else {
      throw new Error('Ville ou coordonnées requises');
    }

    if (params.hours) {
      queryParams.append('hours', params.hours.toString());
    }

    if (params.transport) {
      queryParams.append('transport', 'true');
    }

    const response = await apiClient.get<ApiResponse<{
      location: any;
      forecasts: ForecastHour[];
      transportImpact?: any;
      recommendations: string[];
      summary: string;
      hoursRequested: number;
      generatedAt: string;
    }>>(
      `/api/weather/forecast?${queryParams.toString()}`
    );

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Erreur prévisions météo');
    }

    return response.data;
  },
};