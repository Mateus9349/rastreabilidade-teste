import React, { useState, useContext } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity
} from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import Feather from '@expo/vector-icons/Feather';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loginGuest } = useContext(AuthContext);
  const [carregando, setCarregando] = useState<boolean>(false);

  const handleKeycloakLogin = async () => {
    setCarregando(true);
    const loginSuccess = await login(email.trim(), password);
    setCarregando(false);

    if (!loginSuccess) {
      Alert.alert("Erro de Login", "Não foi possível autenticar no Keycloak. Verifique usuário/senha e as variáveis EXPO_PUBLIC_KEYCLOAK_*.");
    }
  };

  const handleGuest = async () => {
    setCarregando(true);
    await loginGuest();
    setCarregando(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Keycloak</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor={'#F9F9F9'}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        secureTextEntry
        placeholderTextColor={'#F9F9F9'}
      />

      <TouchableOpacity style={styles.btn} onPress={handleKeycloakLogin} disabled={carregando}>
        <Text style={styles.btnText}>Entrar com Keycloak</Text>
      </TouchableOpacity>
      {carregando && <ActivityIndicator style={styles.loading} />}

      <TouchableOpacity style={styles.btn2} onPress={handleGuest} disabled={carregando}>
        <Feather name="user" size={34} color="white" />
        <Text style={styles.btnText}>Entrar como convidado</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    gap: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    color: '#D4A85B',
    fontWeight: 200
  },
  input: {
    width: '100%',
    padding: 8,
    borderWidth: 1,
    borderColor: '#D4A85B',
    marginBottom: 16,
    borderRadius: 15,
    textAlign: 'center',
    color: '#FFFFF',
    fontSize: 12
  },
  loading: {
    marginTop: 16
  },
  btn: {
    width: 200,
    borderRadius: 10,
    backgroundColor: '#871B21',
    padding: 12
  },
  btn2: {
    width: 200,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#320d0fff',
    padding: 8,
    gap: 16,
    position: 'relative',
    top: 120
  },
  btnText: {
    color: '#F9F9F9',
    textAlign: 'center'
  }
});
