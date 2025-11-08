// app/(tabs)/favorites.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { communityService } from '@/services/api/community';
import { Favorite } from '@/types/api';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';
import { useFocusEffect } from '@react-navigation/native';

export default function FavoritesScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const data = await communityService.getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error('Erreur chargement favoris:', error);
      Alert.alert('Erreur', 'Impossible de charger vos favoris');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  const handleRemoveFavorite = (favoriteId: string, stopName: string) => {
    Alert.alert(
      'Retirer des favoris',
      `Voulez-vous retirer "${stopName}" de vos favoris ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Retirer',
          style: 'destructive',
          onPress: async () => {
            try {
              await communityService.removeFavorite(favoriteId);
              setFavorites(prev => prev.filter(f => f.id !== favoriteId));
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de retirer ce favori');
            }
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const renderFavoriteItem = ({ item }: { item: Favorite }) => (
    <TouchableOpacity
      style={styles.favoriteItem}
      onPress={() => router.push(`/stop/${item.stopId}`)}
    >
      <View style={styles.favoriteIcon}>
        <Ionicons name="star" size={24} color={Colors.warning} />
      </View>

      <View style={styles.favoriteInfo}>
        <Text style={styles.favoriteName}>{item.stop.name}</Text>
        
        <View style={styles.stopMeta}>
          <View style={styles.metaItem}>
            <Ionicons
              name="location"
              size={14}
              color={Colors.text.secondary.light}
            />
            <Text style={styles.metaText}>{item.stop.stopType}</Text>
          </View>

          {item.stop.rating && (
            <View style={styles.metaItem}>
              <Ionicons
                name="star"
                size={14}
                color={Colors.warning}
              />
              <Text style={styles.metaText}>
                {item.stop.rating.toFixed(1)}
              </Text>
            </View>
          )}
        </View>

        {item.stop.lines && item.stop.lines.length > 0 && (
          <View style={styles.linesPreview}>
            {item.stop.lines.slice(0, 3).map((line) => (
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
            {item.stop.lines.length > 3 && (
              <Text style={styles.moreLinesText}>
                +{item.stop.lines.length - 3}
              </Text>
            )}
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFavorite(item.stopId, item.stop.name)}
      >
        <Ionicons name="heart" size={24} color={Colors.danger} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Ionicons name="heart-outline" size={64} color={Colors.text.disabled.light} />
      </View>
      <Text style={styles.emptyTitle}>Aucun favori</Text>
      <Text style={styles.emptyText}>
        Ajoutez vos arrêts préférés en appuyant sur le cœur
      </Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => router.push('/')}
      >
        <Text style={styles.exploreButtonText}>Explorer la carte</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Chargement de vos favoris...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Favoris</Text>
        <Text style={styles.subtitle}>
          {favorites.length} {favorites.length > 1 ? 'arrêts' : 'arrêt'}
        </Text>
      </View>

      <FlatList
        data={favorites}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContainer,
          favorites.length === 0 && styles.emptyListContainer
        ]}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      />
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
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  title: {
    fontSize: FontSizes.title,
    fontWeight: '700',
    color: Colors.text.primary.light,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary.light,
  },
  listContainer: {
    padding: Spacing.md,
  },
  emptyListContainer: {
    flex: 1,
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.background.light,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.warning + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  favoriteInfo: {
    flex: 1,
  },
  favoriteName: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text.primary.light,
    marginBottom: Spacing.xs,
  },
  stopMeta: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary.light,
  },
  linesPreview: {
    flexDirection: 'row',
    alignItems: 'center',
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
  moreLinesText: {
    fontSize: FontSizes.xs,
    color: Colors.text.secondary.light,
    fontWeight: '500',
  },
  removeButton: {
    padding: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.text.primary.light,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary.light,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  exploreButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
  },
  exploreButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.background.light,
  },
});