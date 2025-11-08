// app/auth/forgot-password.tsx
import { BorderRadius, Colors, FontSizes, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const validateEmail = (): boolean => {
    if (!email.trim()) {
      setError('Email requis');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email invalide');
      return false;
    }
    return true;
  };

  const handleResetPassword = async () => {
    setError('');
    
    if (!validateEmail()) return;

    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (err: any) {
      Alert.alert('Erreur', err.message);
    }
  };

  if (sent) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.content}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={64} color={Colors.success} />
          </View>
          
          <Text style={styles.successTitle}>Email envoyé !</Text>
          <Text style={styles.successText}>
            Un email de réinitialisation a été envoyé à{'\n'}
            <Text style={styles.emailText}>{email}</Text>
          </Text>
          
          <Text style={styles.infoText}>
            Vérifiez votre boîte de réception et suivez les instructions pour réinitialiser votre mot de passe.
          </Text>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Retour à la connexion</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resendButton}
            onPress={() => {
              setSent(false);
              setEmail('');
            }}
          >
            <Text style={styles.resendButtonText}>
              Envoyer à une autre adresse
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.text.primary.light} />
          </TouchableOpacity>
        </View>

        {/* Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="lock-closed" size={48} color={Colors.primary} />
        </View>

        {/* Title & Description */}
        <Text style={styles.title}>Mot de passe oublié ?</Text>
        <Text style={styles.description}>
          Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </Text>

        {/* Email Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={[
            styles.inputContainer,
            error && styles.inputError
          ]}>
            <Ionicons
              name="mail-outline"
              size={20}
              color={Colors.text.secondary.light}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="votre@email.com"
              placeholderTextColor={Colors.text.secondary.light}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError('');
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              editable={!loading}
            />
          </View>
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
        </View>

        {/* Send Button */}
        <TouchableOpacity
          style={[
            styles.sendButton,
            loading && styles.sendButtonDisabled
          ]}
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.background.light} />
          ) : (
            <Text style={styles.sendButtonText}>Envoyer le lien</Text>
          )}
        </TouchableOpacity>

        {/* Back to Login */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.back()}
          disabled={loading}
        >
          <Ionicons name="arrow-back" size={16} color={Colors.primary} />
          <Text style={styles.loginButtonText}>Retour à la connexion</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  closeButton: {
    alignSelf: 'flex-start',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.heading,
    fontWeight: '700',
    color: Colors.text.primary.light,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary.light,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.text.primary.light,
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface.light,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    paddingHorizontal: Spacing.md,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text.primary.light,
    paddingVertical: Spacing.md,
  },
  errorText: {
    fontSize: FontSizes.sm,
    color: Colors.danger,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    marginBottom: Spacing.md,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.text.disabled.light,
  },
  sendButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.background.light,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    padding: Spacing.md,
  },
  loginButtonText: {
    fontSize: FontSizes.md,
    color: Colors.primary,
    fontWeight: '600',
  },
  successIcon: {
    alignSelf: 'center',
    marginTop: Spacing.xxl,
    marginBottom: Spacing.lg,
  },
  successTitle: {
    fontSize: FontSizes.heading,
    fontWeight: '700',
    color: Colors.text.primary.light,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  successText: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary.light,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  emailText: {
    fontWeight: '600',
    color: Colors.primary,
  },
  infoText: {
    fontSize: FontSizes.sm,
    color: Colors.text.secondary.light,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  backButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  backButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.background.light,
  },
  resendButton: {
    padding: Spacing.md,
    alignItems: 'center',
  },
  resendButtonText: {
    fontSize: FontSizes.md,
    color: Colors.text.secondary.light,
    textDecorationLine: 'underline',
  },
});