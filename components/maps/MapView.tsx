// components/map/MapView.tsx
import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Stop } from '@/types/api';
import { Config, Colors } from '@/constants/theme';
import { stopsService } from '@/services/api/stops';

interface Props {
  initialRegion?: Region;
  stops?: Stop[];
  onStopPress?: (stop: Stop) => void;
  onRegionChange?: (region: Region) => void;
  showUserLocation?: boolean;
}

export function GbakaMapView({
  initialRegion,
  stops: propStops,
  onStopPress,
  onRegionChange,
  showUserLocation = true,
}: Props) {
  const mapRef = useRef<MapView>(null);
  const [stops, setStops] = useState<Stop[]>(propStops || []);
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState<Region>(
    initialRegion || {
      ...Config.DEFAULT_LOCATION,
      ...Config.DEFAULT_DELTA,
    }
  );

  // Charger les arrêts quand la région change
  const loadStops = async (newRegion: Region) => {
    try {
      setLoading(true);
      
      const data = await stopsService.getStops({
        lat: newRegion.latitude,
        lon: newRegion.longitude,
        radius: 2000,
        limit: 50,
      });

      setStops(data.stops);
    } catch (error) {
      console.error('Erreur chargement arrêts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!propStops) {
      loadStops(region);
    }
  }, [region.latitude, region.longitude]);

  const handleRegionChangeComplete = (newRegion: Region) => {
    setRegion(newRegion);
    onRegionChange?.(newRegion);
  };

  const getMarkerColor = (stop: Stop): string => {
    if (stop.stopType === 'STATION') return Colors.transport.bus;
    if (stop.gbaka) return Colors.transport.gbaka;
    if (stop.woroworo) return Colors.transport.woroworo;
    if (stop.taxi) return Colors.transport.taxi;
    if (stop.mototaxi) return Colors.transport.mototaxi;
    return Colors.primary;
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={handleRegionChangeComplete}
        showsUserLocation={showUserLocation}
        showsMyLocationButton={showUserLocation}
        showsCompass
        showsScale
        toolbarEnabled={false}
      >
        {stops.map((stop) => (
          <Marker
            key={stop.id}
            coordinate={{
              latitude: stop.lat,
              longitude: stop.lon,
            }}
            title={stop.name}
            description={stop.lines?.map(l => l.name).join(', ')}
            pinColor={getMarkerColor(stop)}
            onPress={() => onStopPress?.(stop)}
          />
        ))}
      </MapView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginHorizontal: 16,
  },
});