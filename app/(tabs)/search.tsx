// app/(tabs)/search.tsx
import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { stopsService } from '@/services/api/stops';
import { routesService } from '@/services/api/routes';
import { useLocation } from '@/hooks/useLocation';
import { Stop, Coordinates } from '@/types/api';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';

type SearchMode = 'stops' | 'routes';

export default function SearchScreen() {
  const router = useRouter();
  const { location } = useLocation();
  
  const [mode, setMode] = useState<SearchMode>('stops');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [stops, setStops] = useState<Stop[]>([]);
  
  // Pour la recherche d'itinéraire
  const [fromLocation, setFromLocation] = useState<Coordinates | null>(null);
  const [toLocation, setToLocation] = useState<Coordinates | null>(null);
  const [routeResult, setRouteResult] = useState<any>(null);

  // Recherche d'arrêts
  const searchStops = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || !location) return;

    try {
      setLoading(true);
      const data = await stopsService.searchNearby({
        lat: location.latitude,
        lon: location.longitude,
        q: searchQuery,
        radius: 5000,
        cluster: false,
      });

      const allStops = data.results.flatMap((r: any) => r.items || []);
      setStops(allStops);
    } catch (error) {
      console.error('Erreur recherche:', error);
    } finally {
      setLoading(false);
    }
  }, [location]);

  // Recherche d'itinéraire
  const searchRoute = async () => {
    if (!fromLocation || !toLocation) return;

    try {
      setLoading(true);
      const result = await routesService.getRoute({
        from: fromLocation,
        to: toLocation,
        suggestions: true,
        weather: true,
      });

      setRouteResult(result);
    } catch (error) {
      console.error('Erreur itinéraire:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (mode === 'stops') {
      searchStops(query);
    } else {
      searchRoute();
    }
  };

  const renderStopItem = ({ item }: { item: Stop }) => (
    <TouchableOpacity
      style={styles.stopItem}
      onPress={() => router.push(`/stop/${item.id}`)}
    >
      <View style={styles.stopIcon}>
        <Ionicons name="location" size={24} color={Colors.primary} />
      </View>
      
      <View style={styles.stopInfo}>
        <Text style={styles.stopName}>{item.name}</Text>
        <Text style={styles.stopDistance}>
          {item.distance ? `À ${Math.round(item.distance)}m` : 'Distance inconnue'}
        </Text>
        
        {item.lines && item.lines.length > 0 && (
          <View style={styles.linesPreview}>
            {item.lines.slice(0, 3).map((line) => (
              <View
                key={line.id}
                style={[
                  styles.lineTag,
                  { backgroundColor: line.color + '30' }
                ]}
              >
                <Text style={[styles.lineTagText, { color: line.color }]}>
                  {line.shortName || line.name}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary.light} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Rechercher</Text>
      </View>

      {/* Mode Selector */}
      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'stops' && styles.modeButtonActive]}
          onPress={() => setMode('stops')}
        >
          <Ionicons
            name="location"
            size={20}
            color={mode === 'stops' ? Colors.primary : Colors.text.secondary.light}
          />
          <Text
            style={[
              styles.modeText,
              mode === 'stops' && styles.modeTextActive
            ]}
          >
            Arrêts
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeButton, mode === 'routes' && styles.modeButtonActive]}
          onPress={() => setMode('routes')}
        >
          <Ionicons
            name="navigate"
            size={20}
            color={mode === 'routes' ? Colors.primary : Colors.text.secondary.light}
          />
          <Text
            style={[
              styles.modeText,
              mode === 'routes' && styles.modeTextActive
            ]}
          >
            Itinéraires
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      {mode === 'stops' ? (
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={Colors.text.secondary.light}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un arrêt..."
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={20} color={Colors.text.secondary.light} />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.routeInputs}>
          <View style={styles.inputRow}>
            <View style={styles.routeDot} style={{ backgroundColor: Colors.primary }} />
            <TextInput
              style={styles.routeInput}
              placeholder="Point de départ"
              placeholderTextColor={Colors.text.secondary.light}
            />
          </View>
          
          <View style={styles.inputRow}>
            <View style={[styles.routeDot, { backgroundColor: Colors.secondary }]} />
            <TextInput
              style={styles.routeInput}
              placeholder="Destination"
              placeholderTextColor={Colors.text.secondary.light}
            />
          </View>

          <TouchableOpacity
            style={styles.searchButton}
            onPress={searchRoute}
            disabled={!fromLocation || !toLocation}
          >
            <Text style={styles.searchButtonText}>Rechercher l'itinéraire</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Results */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Recherche en cours...</Text>
        </View>
      ) : mode === 'stops' ? (
        stops.length > 0 ? (
          <FlatList
            data={stops}
            renderItem={renderStopItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : query.length > 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={64} color={Colors.text.disabled.light} />
            <Text style={styles.emptyText}>Aucun arrêt trouvé</Text>
            <Text style={styles.emptySubtext}>
              Essayez avec un autre terme de recherche
            </Text>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="location-outline" size={64} color={Colors.text.disabled.light} />
            <Text style={styles.emptyText}>Recherchez un arrêt</Text>
            <Text style={styles.emptySubtext}>
              Entrez le nom d'un arrêt pour commencer
            </Text>
          </View>
        )
      ) : routeResult ? (
        <ScrollView style={styles.routeResults}>
          {/* Affichage des résultats d'itinéraire */}
          <View style={styles.routeCard}>
            <Text style={styles.routeTitle}>Itinéraire trouvé</Text>
            <Text style={styles.routeDistance}>
              Distance: {(routeResult.routes[0].distance / 1000).toFixed(1)} km
            </Text>
            <Text style={styles.routeDuration}>
              Durée: {Math.round(routeResult.routes[0].duration / 60)} min
            </Text>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="navigate-outline" size={64} color={Colors.text.disabled.light} />
          <Text style={styles.emptyText}>Planifiez votre trajet</Text>
          <Text style={styles.emptySubtext}>
            Entrez votre départ et votre destination
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  header: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  title: {
    fontSize: FontSizes.title,
    fontWeight: '700',
    color: Colors.text.primary.light,
  },
  modeSelector: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface.light,
  },
  modeButtonActive: {
    backgroundColor: Colors.primary + '15',
  },
  modeText: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary.light,
    fontWeight: '500',
  },
  modeTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface.light,
    borderRadius: BorderRadius.lg,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text.primary.light,
    paddingVertical: Spacing.sm,
  },
  routeInputs: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface.light,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: BorderRadius.full,
  },
  routeInput: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text.primary.light,
    paddingVertical: Spacing.md,
  },
  searchButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  searchButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.background.light,
  },
  listContainer: {
    padding: Spacing.md,
  },
  stopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.background.light,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  stopIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  stopInfo: {
    flex: 1,
  },
  stopName: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text.primary.light,
    marginBottom: Spacing.xs,
  },
  stopDistance: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary.light,
    marginBottom: Spacing.xs,
  },
  linesPreview: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  lineTag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  lineTagText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary.light,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    color: Colors.text.primary.light,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary.light,
    textAlign: 'center',
  },
  routeResults: {
    flex: 1,
    padding: Spacing.md,
  },
  routeCard: {
    backgroundColor: Colors.background.light,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routeTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.text.primary.light,
    marginBottom: Spacing.md,
  },
  routeDistance: {
    fontSize: FontSizes.lg,
    color: Colors.text.primary.light,
    marginBottom: Spacing.sm,
  },
  routeDuration: {
    fontSize: FontSizes.lg,
    color: Colors.text.secondary.light,
  },
});