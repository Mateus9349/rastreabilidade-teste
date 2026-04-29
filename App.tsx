import React, { useCallback, useEffect, useState } from "react";
import { StatusBar, Text, View } from "react-native";

import * as SplashScreen from "expo-splash-screen";
import * as NavigationBar from "expo-navigation-bar";
import { openDatabaseSync, SQLiteProvider } from "expo-sqlite";

import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";

import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";

import migrations from "./drizzle/migrations";

import { AuthProvider } from "./src/contexts/AuthContext";
import AppNavigator from "./src/routes/AppNavigator";
import { theme } from "./src/theme";

const DATABASE_NAME = "database.db";
const SPLASH_MIN_DURATION = 3000;
const NAVIGATION_BAR_COLOR = "#1C1D1F";

SplashScreen.preventAutoHideAsync();

const expoDB = openDatabaseSync(DATABASE_NAME);
const db = drizzle(expoDB);

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(NAVIGATION_BAR_COLOR);
  }, []);

  useEffect(() => {
    async function prepareApp() {
      if (!success) return;

      try {
        await new Promise((resolve) =>
          setTimeout(resolve, SPLASH_MIN_DURATION)
        );
      } catch (err) {
        console.warn(err);
      } finally {
        setAppIsReady(true);
      }
    }

    prepareApp();
  }, [success]);

  const handleRootLayout = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (error) {
    return (
      <AppProviders>
        <CenteredContainer>
          <Text>{error.message}</Text>
        </CenteredContainer>
      </AppProviders>
    );
  }

  if (!appIsReady) {
    return null;
  }

  return (
    <AppProviders>
      <NavigationContainer>
        <StatusBar
          backgroundColor={NAVIGATION_BAR_COLOR}
          barStyle="light-content"
        />

        <View style={{ flex: 1 }} onLayout={handleRootLayout}>
          <AppNavigator />
        </View>
      </NavigationContainer>
    </AppProviders>
  );
}

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <SQLiteProvider databaseName={DATABASE_NAME}>
          {children}
        </SQLiteProvider>
      </AuthProvider>
    </PaperProvider>
  );
}

function CenteredContainer({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      }}
    >
      {children}
    </View>
  );
}