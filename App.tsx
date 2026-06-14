import React, { useCallback, useEffect, useState } from "react";
import { StatusBar, Text, View } from "react-native";

import * as SplashScreen from "expo-splash-screen";
import * as NavigationBar from "expo-navigation-bar";
import { openDatabaseSync, SQLiteProvider } from "expo-sqlite";

import { NavigationContainer } from "@react-navigation/native";
import {
  ActivityIndicator,
  Button,
  Provider as PaperProvider,
} from "react-native-paper";

import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";

import migrations from "./drizzle/migrations";

import { AuthProvider } from "./src/contexts/AuthContext";
import AppErrorBoundary from "./src/components/ErrorBoundary";
import AppNavigator from "./src/routes/AppNavigator";
import { theme } from "./src/theme";
import { useCriaComunidadesELagosBase } from "./src/utils/useCriaComunidadesELagosBase";

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
    if (appIsReady || error) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady, error]);

  if (error) {
    return (
      <View style={{ flex: 1 }} onLayout={handleRootLayout}>
        <PaperProvider theme={theme}>
          <CenteredContainer>
            <Text>Falha ao preparar o banco local.</Text>
            <Text>{error.message}</Text>
          </CenteredContainer>
        </PaperProvider>
      </View>
    );
  }

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={handleRootLayout}>
      <AppErrorBoundary>
        <AppProviders>
          <NavigationContainer>
            <StatusBar
              backgroundColor={NAVIGATION_BAR_COLOR}
              barStyle="light-content"
            />

            <AppNavigator />
          </NavigationContainer>
        </AppProviders>
      </AppErrorBoundary>
    </View>
  );
}

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <SQLiteProvider databaseName={DATABASE_NAME}>
          <DatabaseBootstrap>{children}</DatabaseBootstrap>
        </SQLiteProvider>
      </AuthProvider>
    </PaperProvider>
  );
}

function DatabaseBootstrap({ children }: { children: React.ReactNode }) {
  const { criarBase } = useCriaComunidadesELagosBase();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const prepararBanco = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await criarBase();
    } catch (err) {
      const nextError =
        err instanceof Error
          ? err
          : new Error("Nao foi possivel preparar o banco local.");
      console.error("[DatabaseBootstrap] Falha", err);
      setError(nextError);
    } finally {
      setLoading(false);
    }
  }, [criarBase]);

  useEffect(() => {
    prepararBanco();
  }, [prepararBanco]);

  if (loading) {
    return (
      <CenteredContainer>
        <ActivityIndicator size="large" />
        <Text>Preparando banco local...</Text>
      </CenteredContainer>
    );
  }

  if (error) {
    return (
      <CenteredContainer>
        <Text>Falha ao preparar dados locais.</Text>
        <Text>{error.message}</Text>
        <Button mode="contained" onPress={prepararBanco}>
          Tentar novamente
        </Button>
      </CenteredContainer>
    );
  }

  return <>{children}</>;
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
