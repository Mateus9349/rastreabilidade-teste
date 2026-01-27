import React, { useContext } from "react";
import { View, ActivityIndicator } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../contexts/AuthContext";
import { RootStackParamList } from "../navigation/types";

import HomeScreen from "../pages/HomeScreen";
import DetailsScreen from "../pages/DetailsScreen";
import RegistrarPeixe from "../pages/RegistrarPeixe";
import Teste from "../pages/TesteScreen";
import PeixesRegistrados from "../pages/PeixesRegistrados";
import PescasScreen from "../pages/PescasScreen";
import GuiaDeTransporte from "../pages/GuiaDeTransporte";
import GuiaDeConfirmacao from "../pages/GuiaDeConfirmacao";
import LoginScreen from "../pages/LoginScreen";
import UserScreen from "../pages/UserScreen";
import PrepararLoteScreen from "../pages/PrepararLoteScreen";
import Comunidades from "../pages/Comunidades";
import Lagos from "../pages/Lagos";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
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
        contentStyle: { backgroundColor: "#1C1D1F" },
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Pescas" component={PescasScreen} options={screenOptions} />
          <Stack.Screen name="RegistrarPeixe" component={RegistrarPeixe} options={screenOptions} />
          <Stack.Screen name="PeixesRegistrados" component={PeixesRegistrados} options={screenOptions} />
          <Stack.Screen name="PrepararLote" component={PrepararLoteScreen} options={screenOptions} />
          <Stack.Screen name="Details" component={DetailsScreen} />
          <Stack.Screen name="Teste" component={Teste} />
          <Stack.Screen name="GuiaDeTransporte" component={GuiaDeTransporte} options={screenOptions} />
          <Stack.Screen name="GuiaDeConfirmacao" component={GuiaDeConfirmacao} options={screenOptions} />
          <Stack.Screen name="User" component={UserScreen} options={screenOptions} />
          <Stack.Screen name="Comunidades" component={Comunidades} options={screenOptions}/>
          <Stack.Screen name="Lagos" component={Lagos} options={screenOptions}/>
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
}

const screenOptions = {
  headerTitle: "voltar",
  headerTintColor: "#FFFFFF",
  headerBackground: () => (
    <View style={{ flex: 1, backgroundColor: "#1C1D1F" }} />
  ),
};
