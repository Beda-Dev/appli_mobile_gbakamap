/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';


// constants/theme.ts

export const Colors = {
  primary: '#0A9396',
  primaryDark: '#005F73',
  primaryLight: '#94D2BD',
  
  secondary: '#F72585',
  secondaryDark: '#B5179E',
  secondaryLight: '#FF8FA3',
  
  accent: '#FF6B35',
  accentDark: '#E63946',
  accentLight: '#FF9E80',
  
  success: '#2ECC71',
  warning: '#F39C12',
  danger: '#E74C3C',
  info: '#3498DB',
  
  background: {
    light: '#FFFFFF',
    dark: '#1A1A1A',
  },
  
  surface: {
    light: '#F5F5F5',
    dark: '#2A2A2A',
  },
  
  text: {
    primary: {
      light: '#212121',
      dark: '#FFFFFF',
    },
    secondary: {
      light: '#757575',
      dark: '#B0B0B0',
    },
    disabled: {
      light: '#BDBDBD',
      dark: '#616161',
    },
  },
  
  border: {
    light: '#E0E0E0',
    dark: '#424242',
  },
  
  transport: {
    bus: '#FF6B35',
    gbaka: '#0A9396',
    woroworo: '#F72585',
    taxi: '#FFB703',
    mototaxi: '#8338EC',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const FontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  heading: 28,
  title: 32,
};

export const FontWeights = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

// Constantes de l'application
export const Config = {
  // Abidjan - coordonnées par défaut
  DEFAULT_LOCATION: {
    latitude: 5.3364,
    longitude: -4.0267,
  },
  
  DEFAULT_DELTA: {
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  
  // Rayons de recherche
  SEARCH_RADIUS: {
    MIN: 100,
    DEFAULT: 2000,
    MAX: 10000,
  },
  
  // Limites API
  API_LIMITS: {
    STOPS_PER_REQUEST: 100,
    SEARCH_HISTORY_SIZE: 20,
  },
  
  // Durées de cache
  CACHE_DURATION: {
    STOPS: 12 * 60 * 60 * 1000, // 12 heures
    LINES: 24 * 60 * 60 * 1000, // 24 heures
    WEATHER: 10 * 60 * 1000, // 10 minutes
  },
};

// Types de transport avec labels et icônes
export const TRANSPORT_TYPES = {
  BUS: {
    label: 'Bus',
    icon: 'bus',
    color: Colors.transport.bus,
    priceRange: '200-500 FCFA',
  },
  GBAKA: {
    label: 'Gbaka',
    icon: 'car',
    color: Colors.transport.gbaka,
    priceRange: '100-250 FCFA',
  },
  WORO_WORO: {
    label: 'Wôrô-wôrô',
    icon: 'car-side',
    color: Colors.transport.woroworo,
    priceRange: '50-150 FCFA',
  },
  TAXI: {
    label: 'Taxi',
    icon: 'taxi',
    color: Colors.transport.taxi,
    priceRange: '500+ FCFA',
  },
  MOTO_TAXI: {
    label: 'Moto-taxi',
    icon: 'motorcycle',
    color: Colors.transport.mototaxi,
    priceRange: '100-400 FCFA',
  },
};

// Types de signalement
export const REPORT_TYPES = {
  MISSING_STOP: {
    label: 'Arrêt manquant',
    icon: 'map-marker-plus',
    color: Colors.info,
  },
  INCORRECT_INFO: {
    label: 'Information incorrecte',
    icon: 'alert-circle',
    color: Colors.warning,
  },
  DAMAGE: {
    label: 'Dégradation',
    icon: 'alert',
    color: Colors.danger,
  },
  SAFETY_ISSUE: {
    label: 'Problème de sécurité',
    icon: 'shield-alert',
    color: Colors.danger,
  },
  NEW_LINE: {
    label: 'Nouvelle ligne',
    icon: 'route',
    color: Colors.success,
  },
  SCHEDULE_CHANGE: {
    label: 'Changement d\'horaire',
    icon: 'clock',
    color: Colors.warning,
  },
  DUPLICATE_STOP: {
    label: 'Doublon',
    icon: 'content-copy',
    color: Colors.warning,
  },
  OTHER: {
    label: 'Autre',
    icon: 'dots-horizontal',
    color: Colors.text.secondary.light,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
