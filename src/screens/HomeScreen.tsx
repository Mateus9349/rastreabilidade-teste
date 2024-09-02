import React from 'react';
import { View, Text, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>

      <Button
        title="Registrar peixe"
        onPress={() => navigation.navigate('RegistrarPeixe')}
      />

      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />

      <Button
        title="Go to Teste"
        onPress={() => navigation.navigate('Teste')}
      />

      <Button
        title="Go to Registros"
        onPress={() => navigation.navigate('PeixesRegistrados')}
      />
    </View>
  );
}



