// app/stop/[id].tsx
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { stopsService } from '@/services/api/stops';
import { communityService } from '@/services/api/community';
import { Stop } from '@/types/api';
import { Colors, Spacing, BorderRadius, FontSizes, TRANSPORT_TYPES } from '@/constants/theme';

export default function StopDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [stop, setStop] = useState<Stop | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadStopDetails();
    checkFavoriteStatus();
  }, [id]);

  const loadStopDetails = async () => {
    try {
      setLoading(true);
      const data = await stopsService.getStopById(id as string);
      setStop(data);
    } catch (error) {
      console.error('Erreur chargement arrêt:', error);
      Alert.alert('Erreur', 'Impossible de charger les détails de l\'arrêt');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const favorite = await communityService.isFavorite(id as string);
      setIsFavorite(favorite);
    } catch (error) {
      console.error('Erreur vérification favori:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await communityService.removeFavorite(id as string);
        setIsFavorite(false);
      } else {
        await communityService.addFavorite(id as string);
        setIsFavorite(true);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de modifier les favoris');
    }
  };

  const openInMaps = () => {
    if (!stop) return;
    
    const url = `geo:${stop.lat},${stop.lon}?q=${stop.lat},${stop.lon}(${encodeURIComponent(stop.name)})`;
    Linking.openURL(url);
  };

  const handleReport = () => {
    // TODO: Navigate to report screen
    Alert.alert('Signalement', 'Fonctionnalité à venir');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (!stop) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary.light} />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={toggleFavorite}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? Colors.danger : Colors.text.primary.light}
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.headerButton}
            onPress={openInMaps}
          >
            <Ionicons name="navigate" size={24} color={Colors.text.primary.light} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Map Preview */}
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: stop.lat,
              longitude: stop.lon,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
          >
            <Marker
              coordinate={{
                latitude: stop.lat,
                longitude: stop.lon,
              }}
              title={stop.name}
            />
          </MapView>
        </View>

        {/* Stop Info */}
        <View style={styles.content}>
          <View style={styles.nameContainer}>
            <Text style={styles.stopName}>{stop.name}</Text>
            {stop.verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                <Text style={styles.verifiedText}>Vérifié</Text>
              </View>
            )}
          </View>

          {/* Rating */}
          {stop.rating && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={20} color={Colors.warning} />
              <Text style={styles.ratingText}>
                {stop.rating.toFixed(1)}
              </Text>
              <Text style={styles.ratingCount}>
                ({stop.ratingCount} avis)
              </Text>
            </View>
          )}

          {/* Facilities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Équipements</Text>
            <View style={styles.facilitiesGrid}>
              <View style={[styles.facilityCard, stop.shelter && styles.facilityActive]}>
                <Ionicons
                  name="umbrella"
                  size={24}
                  color={stop.shelter ? Colors.success : Colors.text.disabled.light}
                />
                <Text style={[
                  styles.facilityLabel,
                  stop.shelter && styles.facilityLabelActive
                ]}>
                  Abri
                </Text>
              </View>

              <View style={[styles.facilityCard, stop.bench && styles.facilityActive]}>
                <Ionicons
                  name="bed"
                  size={24}
                  color={stop.bench ? Colors.success : Colors.text.disabled.light}
                />
                <Text style={[
                  styles.facilityLabel,
                  stop.bench && styles.facilityLabelActive
                ]}>
                  Banc
                </Text>
              </View>

              <View style={[styles.facilityCard, stop.wheelchair && styles.facilityActive]}>
                <Ionicons
                  name="accessibility"
                  size={24}
                  color={stop.wheelchair ? Colors.success : Colors.text.disabled.light}
                />
                <Text style={[
                  styles.facilityLabel,
                  stop.wheelchair && styles.facilityLabelActive
                ]}>
                  PMR
                </Text>
              </View>
            </View>
          </View>

          {/* Transport Types */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Types de transport</Text>
            <View style={styles.transportTypes}>
              {stop.gbaka && (
                <View style={[
                  styles.transportChip,
                  { backgroundColor: TRANSPORT_TYPES.GBAKA.color + '20' }
                ]}>
                  <Ionicons name="car" size={16} color={TRANSPORT_TYPES.GBAKA.color} />
                  <Text style={[styles.transportText, { color: TRANSPORT_TYPES.GBAKA.color }]}>
                    Gbaka
                  </Text>
                </View>
              )}
              
              {stop.woroworo && (
                <View style={[
                  styles.transportChip,
                  { backgroundColor: TRANSPORT_TYPES.WORO_WORO.color + '20' }
                ]}>
                  <Ionicons name="car-sport" size={16} color={TRANSPORT_TYPES.WORO_WORO.color} />
                  <Text style={[styles.transportText, { color: TRANSPORT_TYPES.WORO_WORO.color }]}>
                    Wôrô-wôrô
                  </Text>
                </View>
              )}
              
              {stop.taxi && (
                <View style={[
                  styles.transportChip,
                  { backgroundColor: TRANSPORT_TYPES.TAXI.color + '20' }
                ]}>
                  <Ionicons name="taxi" size={16} color={TRANSPORT_TYPES.TAXI.color} />
                  <Text style={[styles.transportText, { color: TRANSPORT_TYPES.TAXI.color }]}>
                    Taxi
                  </Text>
                </View>
              )}
              
              {stop.mototaxi && (
                <View style={[
                  styles.transportChip,
                  { backgroundColor: TRANSPORT_TYPES.MOTO_TAXI.color + '20' }
                ]}>
                  <Ionicons name="bicycle" size={16} color={TRANSPORT_TYPES.MOTO_TAXI.color} />
                  <Text style={[styles.transportText, { color: TRANSPORT_TYPES.MOTO_TAXI.color }]}>
                    Moto-taxi
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Lines */}
          {stop.lines && stop.lines.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Lignes ({stop.lines.length})</Text>
              {stop.lines.map((line) => (
                <TouchableOpacity
                  key={line.id}
                  style={styles.lineCard}
                >
                  <View style={[styles.lineColor, { backgroundColor: line.color }]} />
                  <View style={styles.lineInfo}>
                    <Text style={styles.lineName}>{line.name}</Text>
                    {line.operator && (
                      <Text style={styles.lineOperator}>{line.operator}</Text>
                    )}
                  </View>
                  {line.fare && (
                    <View style={styles.fareContainer}>
                      <Text style={styles.fareText}>{line.fare} FCFA</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Actions */}
          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleReport}
            >
              <Ionicons name="flag" size={20} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Signaler un problème</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.light,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.text.secondary.light,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  headerButton: {
    padding: Spacing.sm,
  },
  mapContainer: {
    height: 200,
    backgroundColor: Colors.surface.light,
  },
  map: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  stopName: {
    flex: 1,
    fontSize: FontSizes.heading,
    fontWeight: '700',
    color: Colors.text.primary.light,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    backgroundColor: Colors.success + '15',
    borderRadius: BorderRadius.md,
  },
  verifiedText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    color: Colors.success,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  ratingText: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text.primary.light,
  },
  ratingCount: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary.light,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text.primary.light,
    marginBottom: Spacing.md,
  },
  facilitiesGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  facilityCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.surface.light,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  facilityActive: {
    backgroundColor: Colors.success + '10',
    borderColor: Colors.success + '30',
  },
  facilityLabel: {
    marginTop: Spacing.xs,
    fontSize: FontSizes.sm,
    color: Colors.text.disabled.light,
    fontWeight: '500',
  },
  facilityLabelActive: {
    color: Colors.success,
  },
  transportTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  transportChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  transportText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  lineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.surface.light,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  lineColor: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: Spacing.md,
  },
  lineInfo: {
    flex: 1,
  },
  lineName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text.primary.light,
    marginBottom: 2,
  },
  lineOperator: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary.light,
  },
  fareContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.primary + '15',
    borderRadius: BorderRadius.md,
  },
  fareText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.primary,
  },
  actionsSection: {
    marginTop: Spacing.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.primary + '10',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  actionButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.primary,
  },
});