import React, { useState, useContext } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { ActivityIndicator, Surface, useTheme } from 'react-native-paper';
import Feather from '@expo/vector-icons/Feather';

import { AuthContext } from '../contexts/AuthContext';

import AppButton from '../components/ui/AppButton';
import AppInput from '../components/ui/AppInput';
import AppText from '../components/ui/AppText';

export default function LoginScreen() {
  const theme = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loginGuest } = useContext(AuthContext);
  const [carregando, setCarregando] = useState<boolean>(false);

  const handleKeycloakLogin = async () => {
    setCarregando(true);
    const loginSuccess = await login(email.trim(), password);
    setCarregando(false);

    if (!loginSuccess) {
      Alert.alert(
        'Erro de Login',
        'Não foi possível autenticar no Keycloak. Verifique usuário/senha e as variáveis EXPO_PUBLIC_KEYCLOAK_*.'
      );
    }
  };

  const handleGuest = async () => {
    setCarregando(true);
    await loginGuest();
    setCarregando(false);
  };

  return (
    <Surface style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <Surface style={styles.content}>
        <AppText
          variant="headlineLarge"
          style={[styles.title, { color: theme.colors.primary }]}
        >
          Login
        </AppText>

        <AppText
          variant="bodyMedium"
          style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
        >
          Acesse sua conta para continuar
        </AppText>

        <AppInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          textColor={theme.colors.onSurface}
          placeholderTextColor={theme.colors.onSurfaceVariant}
          style={styles.input}
        />

        <AppInput
          label="Senha"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          secureTextEntry
          textColor={theme.colors.onSurface}
          placeholderTextColor={theme.colors.onSurfaceVariant}
          style={styles.input}
        />

        <AppButton
          mode="contained"
          onPress={handleKeycloakLogin}
          disabled={carregando}
          style={styles.primaryButton}
          contentStyle={styles.buttonContent}
        >
          Entrar
        </AppButton>

        {carregando && (
          <ActivityIndicator
            style={styles.loading}
            color={theme.colors.primary}
          />
        )}

        <AppButton
          mode="contained-tonal"
          onPress={handleGuest}
          disabled={carregando}
          style={styles.guestButton}
          contentStyle={styles.guestButtonContent}
          icon={() => (
            <Feather
              name="user"
              size={24}
              color={theme.colors.onSecondaryContainer}
            />
          )}
        >
          Entrar como convidado
        </AppButton>
      </Surface>
    </Surface>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 28,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  primaryButton: {
    marginTop: 8,
    borderRadius: 12,
  },
  buttonContent: {
    minHeight: 48,
  },
  loading: {
    marginTop: 16,
  },
  guestButton: {
    marginTop: 32,
    borderRadius: 12,
  },
  guestButtonContent: {
    minHeight: 56,
  },
});