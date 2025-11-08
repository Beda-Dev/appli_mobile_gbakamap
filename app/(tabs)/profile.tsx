// app/(tabs)/profile.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';

type MenuItem = {
  id: string;
  icon: string;
  label: string;
  onPress: () => void;
  badge?: number;
  color?: string;
};

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  // User data from auth
  const userData = {
    name: user?.displayName || 'Utilisateur',
    email: user?.email || '',
    avatarColor: Colors.primary,
    contributionsCount: 12,
    favoritesCount: 8,
  };

  const handleSignOut = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement sign out
            console.log('Sign out');
          },
        },
      ]
    );
  };

  const menuSections = [
    {
      title: 'Mon compte',
      items: [
        {
          id: 'favorites',
          icon: 'heart',
          label: 'Mes favoris',
          badge: user.favoritesCount,
          onPress: () => router.push('/favorites'),
        },
        {
          id: 'contributions',
          icon: 'megaphone',
          label: 'Mes signalements',
          badge: user.contributionsCount,
          onPress: () => console.log('Contributions'),
        },
        {
          id: 'history',
          icon: 'time',
          label: 'Historique',
          onPress: () => console.log('History'),
        },
      ] as MenuItem[],
    },
    {
      title: 'Préférences',
      items: [
        {
          id: 'notifications',
          icon: 'notifications',
          label: 'Notifications',
          onPress: () => {},
          toggle: {
            value: notificationsEnabled,
            onValueChange: setNotificationsEnabled,
          },
        },
        {
          id: 'dark-mode',
          icon: 'moon',
          label: 'Mode sombre',
          onPress: () => {},
          toggle: {
            value: darkModeEnabled,
            onValueChange: setDarkModeEnabled,
          },
        },
        {
          id: 'language',
          icon: 'language',
          label: 'Langue',
          onPress: () => console.log('Language'),
          rightText: 'Français',
        },
      ],
    },
    {
      title: 'Application',
      items: [
        {
          id: 'about',
          icon: 'information-circle',
          label: 'À propos',
          onPress: () => console.log('About'),
        },
        {
          id: 'help',
          icon: 'help-circle',
          label: 'Aide & Support',
          onPress: () => console.log('Help'),
        },
        {
          id: 'privacy',
          icon: 'shield-checkmark',
          label: 'Confidentialité',
          onPress: () => console.log('Privacy'),
        },
        {
          id: 'terms',
          icon: 'document-text',
          label: 'Conditions d\'utilisation',
          onPress: () => console.log('Terms'),
        },
      ] as MenuItem[],
    },
  ];

  const renderMenuItem = (item: any) => {
    const hasToggle = 'toggle' in item;

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.menuItem}
        onPress={hasToggle ? undefined : item.onPress}
        disabled={hasToggle}
      >
        <View style={styles.menuItemLeft}>
          <View style={[styles.menuIcon, { backgroundColor: item.color || Colors.primary + '15' }]}>
            <Ionicons
              name={item.icon as any}
              size={20}
              color={item.color || Colors.primary}
            />
          </View>
          <Text style={styles.menuLabel}>{item.label}</Text>
          {item.badge !== undefined && item.badge > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          )}
        </View>

        <View style={styles.menuItemRight}>
          {item.rightText && (
            <Text style={styles.rightText}>{item.rightText}</Text>
          )}
          {hasToggle ? (
            <Switch
              value={item.toggle.value}
              onValueChange={item.toggle.onValueChange}
              trackColor={{ false: Colors.border.light, true: Colors.primary + '50' }}
              thumbColor={item.toggle.value ? Colors.primary : Colors.surface.light}
            />
          ) : (
            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors.text.secondary.light}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profil</Text>
        </View>

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={[styles.avatar, { backgroundColor: user.avatarColor }]}>
            <Text style={styles.avatarText}>
              {user.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.contributionsCount}</Text>
            <Text style={styles.statLabel}>Signalements</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.favoritesCount}</Text>
            <Text style={styles.statLabel}>Favoris</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>125</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
        </View>

        {/* Menu Sections */}
        {menuSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuContainer}>
              {section.items.map(renderMenuItem)}
            </View>
          </View>
        ))}

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
          <Text style={styles.signOutText}>Déconnexion</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
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
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  title: {
    fontSize: FontSizes.title,
    fontWeight: '700',
    color: Colors.text.primary.light,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    margin: Spacing.md,
    backgroundColor: Colors.background.light,
    borderRadius: BorderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.background.light,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    color: Colors.text.primary.light,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary.light,
  },
  editButton: {
    padding: Spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    backgroundColor: Colors.background.light,
    borderRadius: BorderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary.light,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border.light,
    marginHorizontal: Spacing.md,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.text.secondary.light,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  menuContainer: {
    marginHorizontal: Spacing.md,
    backgroundColor: Colors.background.light,
    borderRadius: BorderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  menuLabel: {
    fontSize: FontSizes.md,
    color: Colors.text.primary.light,
    fontWeight: '500',
  },
  badge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    marginLeft: Spacing.sm,
  },
  badgeText: {
    fontSize: FontSizes.xs,
    color: Colors.background.light,
    fontWeight: '600',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  rightText: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary.light,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    margin: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.danger + '10',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.danger + '30',
  },
  signOutText: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.danger,
  },
  versionText: {
    fontSize: FontSizes.sm,
    color: Colors.text.disabled.light,
    textAlign: 'center',
    marginVertical: Spacing.lg,
  },
});