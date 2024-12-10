// src/helpers/authHelper.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const logout = async () => {
  await AsyncStorage.removeItem('@myapp:auth_token');
};
