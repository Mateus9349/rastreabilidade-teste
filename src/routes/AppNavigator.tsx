import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, Surface, useTheme } from "react-native-paper";

import { AuthContext } from "../contexts/AuthContext";
import { RootStackParamList } from "../navigation/types";

import Home from "../pages/Home/Home";
import DetailsScreen from "../pages/DetailsScreen";
import RegistrarPeixe from "../pages/Pescas/components/RegistrarPeixe";
import Teste from "../pages/TesteScreen";
import PeixesRegistrados from "../pages/PeixesRegistrados";
import PescasScreen from "../pages/Pescas/PescasScreen";
import GuiaDeTransporte from "../pages/GuiaDeTransporte";
import GuiaDeConfirmacao from "../pages/GuiaDeConfirmacao";
import LoginScreen from "../pages/LoginScreen";
import UserScreen from "../pages/UserScreen";
import PrepararLoteScreen from "../pages/PrepararLoteScreen";
import Comunidades from "../pages/Comunidades";
import Lagos from "../pages/Lagos";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const theme = useTheme();
  const { isAuthenticated, isGuest, loading } = useContext(AuthContext);

  const canAccessApp = isAuthenticated || isGuest;

  const defaultScreenOptions = {
    headerTitle: "voltar",
    headerTintColor: theme.colors.primary,
    contentStyle: {
      backgroundColor: theme.colors.background,
    },
    headerBackground: () => (
      <View
        style={[
          styles.headerBackground,
          { backgroundColor: theme.colors.background },
        ]}
      />
    ),
  };

  if (loading) {
    return (
      <Surface
        style={[
          styles.loaderContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" />
      </Surface>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={canAccessApp ? "Home" : "Login"}
      screenOptions={{
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      {canAccessApp ? (
        <>
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="Pescas" component={PescasScreen} options={defaultScreenOptions} />
          <Stack.Screen name="RegistrarPeixe" component={RegistrarPeixe} options={defaultScreenOptions} />
          <Stack.Screen name="PeixesRegistrados" component={PeixesRegistrados} options={defaultScreenOptions} />
          <Stack.Screen name="PrepararLote" component={PrepararLoteScreen} options={defaultScreenOptions} />
          <Stack.Screen name="Details" component={DetailsScreen} options={defaultScreenOptions} />
          <Stack.Screen name="Teste" component={Teste} options={defaultScreenOptions} />
          <Stack.Screen name="GuiaDeTransporte" component={GuiaDeTransporte} options={defaultScreenOptions} />
          <Stack.Screen name="GuiaDeConfirmacao" component={GuiaDeConfirmacao} options={defaultScreenOptions} />
          <Stack.Screen name="User" component={UserScreen} options={defaultScreenOptions} />
          <Stack.Screen name="Comunidades" component={Comunidades} options={defaultScreenOptions} />
          <Stack.Screen name="Lagos" component={Lagos} options={defaultScreenOptions} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerBackground: {
    flex: 1,
  },
});