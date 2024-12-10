import { useContext } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/navigation/types';

import { AuthContext, AuthProvider } from "./src/contexts/AuthContext";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync, SQLiteProvider } from "expo-sqlite";
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from './drizzle/migrations';

import HomeScreen from './src/pages/HomeScreen';
import DetailsScreen from './src/pages/DetailsScreen';
import RegistrarPeixe from './src/pages/RegistrarPeixe';
import Teste from "./src/pages/TesteScreen";
import PeixesRegistrados from "./src/pages/PeixesRegistrados";
import PescasScreen from "./src/pages/PescasScreen";
import GuiaDeTransporte from "./src/pages/GuiaDeTransporte";
import GuiaDeConfirmacao from "./src/pages/GuiaDeConfirmacao";
import LoginScreen from "./src/pages/LoginScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

//Configurações db drizzle
const DATABASE_NAME = 'database.db';
const expoDB = openDatabaseSync(DATABASE_NAME);
const db = drizzle(expoDB);

export default function App() {
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{error.message}</Text>
      </View>
    )
  }

  if (!success) {
    return <ActivityIndicator style={{ flex: 1, justifyContent: "center", alignItems: "center" }} />
  }

  return (
    <AuthProvider>
      <SQLiteProvider databaseName={DATABASE_NAME}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SQLiteProvider>
    </AuthProvider>
  );
}

function AppNavigator() {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? "Home" : "Login"}
      screenOptions={{
        contentStyle: { backgroundColor: 'white' }
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Details" component={DetailsScreen} />
          <Stack.Screen name="RegistrarPeixe" component={RegistrarPeixe} />
          <Stack.Screen name="Teste" component={Teste} />
          <Stack.Screen name="PeixesRegistrados" component={PeixesRegistrados} />
          <Stack.Screen name="Pescas" component={PescasScreen} />
          <Stack.Screen name="GuiaDeTransporte" component={GuiaDeTransporte} />
          <Stack.Screen name="GuiaDeConfirmacao" component={GuiaDeConfirmacao} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
}

