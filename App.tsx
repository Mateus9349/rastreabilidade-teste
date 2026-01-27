import React, { useEffect, useState, useCallback } from "react";
import { StatusBar, View, Text, ActivityIndicator } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as NavigationBar from "expo-navigation-bar";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/contexts/AuthContext";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync, SQLiteProvider } from "expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "./drizzle/migrations";
import AppNavigator from "./src/routes/AppNavigator";

// Impede que a splash screen suma automaticamente
SplashScreen.preventAutoHideAsync();

const DATABASE_NAME = "database.db";
const expoDB = openDatabaseSync(DATABASE_NAME);
const db = drizzle(expoDB);

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const { success, error } = useMigrations(db, migrations);

  NavigationBar.setBackgroundColorAsync("#1C1D1F");

  useEffect(() => {
    async function prepare() {
      try {
        // Aguarda as migrations e simula um tempo mínimo de splash
        if (!success) return;
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 segundos
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, [success]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{error.message}</Text>
      </View>
    );
  }

  if (!appIsReady) {
    return null; // Splash ainda visível
  }

  return (
    <AuthProvider>
      <SQLiteProvider databaseName={DATABASE_NAME}>
        <NavigationContainer>
          <StatusBar backgroundColor="#1C1D1F" barStyle="light-content" />
          <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <AppNavigator />
          </View>
        </NavigationContainer>
      </SQLiteProvider>
    </AuthProvider>
  );
}
