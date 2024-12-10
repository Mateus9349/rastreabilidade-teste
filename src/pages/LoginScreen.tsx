// src/pages/LoginScreen.tsx
import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loginTeste } = useContext(AuthContext);
  const [carregando, setCarregando] = useState<boolean>(false);

  const handleLogin = async () => {
    setCarregando(true);
    //const loginSuccess = await login(email, password);
    const loginSuccess = await loginTeste();
    setCarregando(false);

    if (!loginSuccess) {
      Alert.alert("Erro de Login", "Email ou senha incorretos. Tente novamente.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        secureTextEntry
      />
      <Button title="Entrar" onPress={handleLogin} disabled={carregando} />
      {carregando && <ActivityIndicator style={styles.loading} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: 'white'
  },
  title: {
    fontSize: 24,
    marginBottom: 16
  },
  input: {
    width: '100%',
    padding: 8,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 16
  },
  loading: {
    marginTop: 16
  }
});
