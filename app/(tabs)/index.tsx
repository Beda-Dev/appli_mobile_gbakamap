// app/(tabs)/index.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GbakaMapView } from '@/components/map/MapView';
import { useLocation } from '@/hooks/useLocation';
import { Stop } from '@/types/api';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const { location, loading: locationLoading } = useLocation();
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleStopPress = (stop: Stop) => {
    setSelectedStop(stop);
    setModalVisible(true);
  };

  if (locationLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement de la carte...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <GbakaMapView
        initialRegion={
          location
            ? {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }
            : undefined
        }
        onStopPress={handleStopPress}
        showUserLocation
      />

      {/* Boutons d'action flottants */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => {/* TODO: Ouvrir la recherche */}}
        >
          <Ionicons name="search" size={24} color={Colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => {/* TODO: Centrer sur ma position */}}
        >
          <Ionicons name="locate" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Modal détails arrêt */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedStop?.name}
              </Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={Colors.text.primary.light} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.infoRow}>
                <Ionicons name="location" size={20} color={Colors.primary} />
                <Text style={styles.infoText}>
                  {selectedStop?.distance 
                    ? `À ${Math.round(selectedStop.distance)}m` 
                    : 'Distance inconnue'}
                </Text>
              </View>

              {selectedStop?.lines && selectedStop.lines.length > 0 && (
                <View style={styles.linesContainer}>
                  <Text style={styles.linesTitle}>Lignes disponibles:</Text>
                  {selectedStop.lines.map((line) => (
                    <View 
                      key={line.id} 
                      style={[
                        styles.lineChip,
                        { backgroundColor: line.color + '20' }
                      ]}
                    >
                      <View 
                        style={[
                          styles.lineColorDot,
                          { backgroundColor: line.color }
                        ]} 
                      />
                      <Text style={styles.lineText}>{line.name}</Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.facilitiesRow}>
                {selectedStop?.shelter && (
                  <View style={styles.facilityChip}>
                    <Ionicons name="umbrella" size={16} color={Colors.success} />
                    <Text style={styles.facilityText}>Abri</Text>
                  </View>
                )}
                {selectedStop?.bench && (
                  <View style={styles.facilityChip}>
                    <Ionicons name="bed" size={16} color={Colors.success} />
                    <Text style={styles.facilityText}>Banc</Text>
                  </View>
                )}
                {selectedStop?.wheelchair && (
                  <View style={styles.facilityChip}>
                    <Ionicons name="accessibility" size={16} color={Colors.success} />
                    <Text style={styles.facilityText}>PMR</Text>
                  </View>
                )}
              </View>

              <TouchableOpacity 
                style={styles.detailsButton}
                onPress={() => {
                  setModalVisible(false);
                  // TODO: Naviguer vers les détails
                }}
              >
                <Text style={styles.detailsButtonText}>Voir les détails</Text>
                <Ionicons name="arrow-forward" size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    fontSize: 16,
    color: Colors.text.secondary.light,
  },
  actionButtons: {
    position: 'absolute',
    right: Spacing.md,
    bottom: Spacing.xl,
    gap: Spacing.md,
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.light,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.background.light,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingBottom: Spacing.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary.light,
    flex: 1,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  modalBody: {
    padding: Spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.secondary.light,
  },
  linesContainer: {
    marginVertical: Spacing.md,
  },
  linesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary.light,
    marginBottom: Spacing.sm,
  },
  lineChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  lineColorDot: {
    width: 12,
    height: 12,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
  },
  lineText: {
    fontSize: 14,
    color: Colors.text.primary.light,
  },
  facilitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginVertical: Spacing.md,
  },
  facilityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.success + '15',
    borderRadius: BorderRadius.md,
  },
  facilityText: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '500',
  },
  detailsButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.primary + '15',
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
  },
  detailsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
});