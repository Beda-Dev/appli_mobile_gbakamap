// app/route/index.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { routesService } from '@/services/api/routes';
import { useLocation } from '@/hooks/useLocation';
import { Coordinates, TransportSuggestion } from '@/types/api';
import { Colors, Spacing, BorderRadius, FontSizes, TRANSPORT_TYPES } from '@/constants/theme';

export default function RouteScreen() {
  const router = useRouter();
  const { location } = useLocation();
  
  const [fromAddress, setFromAddress] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [fromCoords, setFromCoords] = useState<Coordinates | null>(null);
  const [toCoords, setToCoords] = useState<Coordinates | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [routeData, setRouteData] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<TransportSuggestion[]>([]);

  const handleUseCurrentLocation = () => {
    if (location) {
      setFromCoords(location);
      setFromAddress('Ma position');
    }
  };

  const calculateRoute = async () => {
    if (!fromCoords || !toCoords) {
      alert('Veuillez sélectionner un point de départ et une destination');
      return;
    }

    try {
      setLoading(true);
      const result = await routesService.getRoute({
        from: fromCoords,
        to: toCoords,
        suggestions: true,
        weather: true,
      });

      setRouteData(result);
      setSuggestions(result.suggestions || []);
    } catch (error) {
      console.error('Erreur calcul itinéraire:', error);
      alert('Impossible de calculer l\'itinéraire');
    } finally {
      setLoading(false);
    }
  };

  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'bus': return 'bus';
      case 'gbaka': return 'car';
      case 'woro_woro': return 'car-sport';
      case 'taxi': return 'taxi';
      case 'moto_taxi': return 'bicycle';
      case 'walking': return 'walk';
      default: return 'help-circle';
    }
  };

  const renderSuggestion = (suggestion: TransportSuggestion) => (
    <View key={suggestion.rank} style={styles.suggestionCard}>
      <View style={styles.suggestionHeader}>
        <View style={styles.suggestionLeft}>
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>{suggestion.rank}</Text>
          </View>
          <Ionicons
            name={getTransportIcon(suggestion.mode) as any}
            size={28}
            color={Colors.primary}
          />
          <View>
            <Text style={styles.suggestionMode}>{suggestion.mode}</Text>
            <Text style={styles.suggestionReason}>{suggestion.reason}</Text>
          </View>
        </View>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreText}>{suggestion.overallScore}/100</Text>
        </View>
      </View>

      <View style={styles.suggestionDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="time" size={16} color={Colors.text.secondary.light} />
          <Text style={styles.detailText}>
            ~{Math.round(suggestion.duration / 60)} min
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="cash" size={16} color={Colors.text.secondary.light} />
          <Text style={styles.detailText}>
            {suggestion.priceRange.min}-{suggestion.priceRange.max} FCFA
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="trending-up" size={16} color={Colors.text.secondary.light} />
          <Text style={styles.detailText}>
            Disponibilité: {suggestion.availability}
          </Text>
        </View>
      </View>

      {/* Pros */}
      {suggestion.pros.length > 0 && (
        <View style={styles.prosCons}>
          <Text style={styles.prosConsTitle}>✅ Avantages:</Text>
          {suggestion.pros.map((pro, idx) => (
            <Text key={idx} style={styles.prosText}>• {pro}</Text>
          ))}
        </View>
      )}

      {/* Cons */}
      {suggestion.cons.length > 0 && (
        <View style={styles.prosCons}>
          <Text style={styles.prosConsTitle}>⚠️ Inconvénients:</Text>
          {suggestion.cons.map((con, idx) => (
            <Text key={idx} style={styles.consText}>• {con}</Text>
          ))}
        </View>
      )}

      {/* Advice */}
      {suggestion.advice && suggestion.advice.length > 0 && (
        <View style={styles.adviceContainer}>
          {suggestion.advice.map((tip, idx) => (
            <Text key={idx} style={styles.adviceText}>💡 {tip}</Text>
          ))}
        </View>
      )}
    </View>
  );

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
        <Text style={styles.title}>Calculer un itinéraire</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Input Section */}
        <View style={styles.inputSection}>
          {/* From */}
          <View style={styles.inputContainer}>
            <View style={[styles.inputDot, { backgroundColor: Colors.primary }]} />
            <TextInput
              style={styles.input}
              placeholder="Point de départ"
              value={fromAddress}
              onChangeText={setFromAddress}
            />
            <TouchableOpacity
              style={styles.locationButton}
              onPress={handleUseCurrentLocation}
            >
              <Ionicons name="locate" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Swap Button */}
          <TouchableOpacity
            style={styles.swapButton}
            onPress={() => {
              const tempAddr = fromAddress;
              const tempCoords = fromCoords;
              setFromAddress(toAddress);
              setFromCoords(toCoords);
              setToAddress(tempAddr);
              setToCoords(tempCoords);
            }}
          >
            <Ionicons name="swap-vertical" size={20} color={Colors.text.secondary.light} />
          </TouchableOpacity>

          {/* To */}
          <View style={styles.inputContainer}>
            <View style={[styles.inputDot, { backgroundColor: Colors.secondary }]} />
            <TextInput
              style={styles.input}
              placeholder="Destination"
              value={toAddress}
              onChangeText={setToAddress}
            />
          </View>

          {/* Search Button */}
          <TouchableOpacity
            style={[
              styles.searchButton,
              (!fromCoords || !toCoords) && styles.searchButtonDisabled
            ]}
            onPress={calculateRoute}
            disabled={!fromCoords || !toCoords || loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.background.light} />
            ) : (
              <>
                <Ionicons name="search" size={20} color={Colors.background.light} />
                <Text style={styles.searchButtonText}>Rechercher</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Weather Info */}
        {routeData?.weather && (
          <View style={styles.weatherCard}>
            <View style={styles.weatherHeader}>
              <Ionicons name="partly-sunny" size={24} color={Colors.warning} />
              <Text style={styles.weatherTitle}>{routeData.weather.conditions}</Text>
            </View>
            {routeData.weather.advice?.map((advice: string, idx: number) => (
              <Text key={idx} style={styles.weatherAdvice}>{advice}</Text>
            ))}
          </View>
        )}

        {/* Route Info */}
        {routeData?.routes && routeData.routes[0] && (
          <View style={styles.routeCard}>
            <Text style={styles.routeTitle}>Itinéraire trouvé</Text>
            <View style={styles.routeStats}>
              <View style={styles.routeStat}>
                <Ionicons name="analytics" size={20} color={Colors.primary} />
                <Text style={styles.routeStatLabel}>Distance</Text>
                <Text style={styles.routeStatValue}>
                  {(routeData.routes[0].distance / 1000).toFixed(1)} km
                </Text>
              </View>
              <View style={styles.routeStat}>
                <Ionicons name="time" size={20} color={Colors.primary} />
                <Text style={styles.routeStatLabel}>Durée estimée</Text>
                <Text style={styles.routeStatValue}>
                  {Math.round(routeData.routes[0].duration / 60)} min
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <View style={styles.suggestionsSection}>
            <Text style={styles.sectionTitle}>
              Suggestions de transport ({suggestions.length})
            </Text>
            {suggestions.map(renderSuggestion)}
          </View>
        )}

        {/* Empty State */}
        {!routeData && !loading && (
          <View style={styles.emptyState}>
            <Ionicons name="navigate-circle-outline" size={64} color={Colors.text.disabled.light} />
            <Text style={styles.emptyTitle}>Planifiez votre trajet</Text>
            <Text style={styles.emptyText}>
              Entrez votre point de départ et votre destination pour obtenir des suggestions
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
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
  title: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    color: Colors.text.primary.light,
  },
  inputSection: {
    padding: Spacing.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface.light,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  inputDot: {
    width: 12,
    height: 12,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.md,
  },
  input: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text.primary.light,
    paddingVertical: Spacing.md,
  },
  locationButton: {
    padding: Spacing.sm,
  },
  swapButton: {
    alignSelf: 'center',
    padding: Spacing.sm,
    marginVertical: Spacing.xs,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.sm,
  },
  searchButtonDisabled: {
    backgroundColor: Colors.text.disabled.light,
  },
  searchButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.background.light,
  },
  weatherCard: {
    margin: Spacing.md,
    padding: Spacing.lg,
    backgroundColor: Colors.warning + '10',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.warning + '30',
  },
  weatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  weatherTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text.primary.light,
  },
  weatherAdvice: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary.light,
    marginTop: Spacing.xs,
  },
  routeCard: {
    margin: Spacing.md,
    padding: Spacing.lg,
    backgroundColor: Colors.background.light,
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
  routeStats: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  routeStat: {
    flex: 1,
    alignItems: 'center',
  },
  routeStatLabel: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary.light,
    marginTop: Spacing.xs,
  },
  routeStatValue: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: Spacing.xs,
  },
  suggestionsSection: {
    padding: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text.primary.light,
    marginBottom: Spacing.md,
  },
  suggestionCard: {
    backgroundColor: Colors.background.light,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  suggestionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: Colors.background.light,
  },
  suggestionMode: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text.primary.light,
    textTransform: 'capitalize',
  },
  suggestionReason: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary.light,
  },
  scoreBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.success + '15',
    borderRadius: BorderRadius.lg,
  },
  scoreText: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.success,
  },
  suggestionDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary.light,
  },
  prosCons: {
    marginBottom: Spacing.sm,
  },
  prosConsTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.text.primary.light,
    marginBottom: Spacing.xs,
  },
  prosText: {
    fontSize: FontSizes.sm,
    color: Colors.success,
    marginLeft: Spacing.sm,
  },
  consText: {
    fontSize: FontSizes.sm,
    color: Colors.warning,
    marginLeft: Spacing.sm,
  },
  adviceContainer: {
    marginTop: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.info + '10',
    borderRadius: BorderRadius.md,
  },
  adviceText: {
    fontSize: FontSizes.sm,
    color: Colors.text.primary.light,
    marginBottom: Spacing.xs,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  emptyTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.text.primary.light,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary.light,
    textAlign: 'center',
    lineHeight: 22,
  },
});