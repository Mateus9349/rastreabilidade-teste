import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync, SQLiteProvider } from "expo-sqlite";
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from './drizzle/migrations';


import React from 'react';
import { View, Text, ActivityIndicator } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/navigation/types';

import HomeScreen from './src/screens/HomeScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import RegistrarPeixe from './src/screens/RegistrarPeixe';
import Teste from "./src/screens/TesteScreen";
import PeixesRegistrados from "./src/screens/PeixesRegistrados";
import PescasScreen from "./src/screens/PescasScreen";
import GuiaDeTransporte from "./src/screens/GuiaDeTransporte";
import GuiaDeConfirmacao from "./src/screens/GuiaDeConfirmacao";

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
    <SQLiteProvider databaseName={DATABASE_NAME}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
          <Stack.Screen name="Details" component={DetailsScreen} />
          <Stack.Screen name='RegistrarPeixe' component={RegistrarPeixe} /* options={{headerShown: false}} */ />
          <Stack.Screen name="Teste" component={Teste} />
          <Stack.Screen name="PeixesRegistrados" component={PeixesRegistrados}/>
          <Stack.Screen name="Pescas" component={PescasScreen}/>
          <Stack.Screen name="GuiaDeTransporte" component={GuiaDeTransporte}/>
          <Stack.Screen name="GuiaDeConfirmacao" component={GuiaDeConfirmacao}/>
        </Stack.Navigator>
      </NavigationContainer>
    </SQLiteProvider>
  );
}

