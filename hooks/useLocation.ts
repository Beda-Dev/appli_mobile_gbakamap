// hooks/useLocation.ts
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Config } from '@/constants/theme';

interface LocationData {
  latitude: number;
  longitude: number;
}

interface UseLocationReturn {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  requestPermission: () => Promise<boolean>;
  refreshLocation: () => Promise<void>;
}

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const requestPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setError('Permission de localisation refusée');
        return false;
      }
      
      return true;
    } catch (err) {
      setError('Erreur lors de la demande de permission');
      return false;
    }
  };

  const getLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      const hasPermission = await requestPermission();
      
      if (!hasPermission) {
        // Utiliser la localisation par défaut (Abidjan)
        setLocation(Config.DEFAULT_LOCATION);
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    } catch (err) {
      setError('Impossible d\'obtenir la localisation');
      // Fallback sur Abidjan
      setLocation(Config.DEFAULT_LOCATION);
    } finally {
      setLoading(false);
    }
  };

  const refreshLocation = async () => {
    await getLocation();
  };

  useEffect(() => {
    getLocation();
  }, []);

  return {
    location,
    loading,
    error,
    requestPermission,
    refreshLocation,
  };
}