import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useCustomFonts } from '../types/ts/fonts'; // Ajuste o caminho conforme necessário
import BotaoHome from '../components/BotaoHome';
import { text } from 'drizzle-orm/mysql-core';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [fontsLoaded] = useCustomFonts();
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerUser}>
        <Image source={require('../../assets/icons/user.png')}/>
      </View>

      <Text style={styles.title}>Olá, Fulano</Text>

      <Text style={styles.text}>Selecione uma opção para começar</Text>

      <BotaoHome
        onPress={() => navigation.navigate('Pescas')}
        title='Pescas'
        text='Cadastre novas pescas e monitore pescas atuais'
        src={require('../../assets/icons/peixe.png')}
      />

      <BotaoHome
        onPress={() => navigation.navigate('GuiaDeTransporte')}
        title='Enviar Barco'
        text='Realize envios dos pescados através dos barcos'
        src={require('../../assets/icons/enviar.png')}
      />

      {/* <BotaoHome
        onPress={() => navigation.navigate('Details')}
        title='Acompanhar Envios'
        text='Acompanhe todos os envios dos pescados realizados'
        src={require('../../assets/icons/envios.png')}
      /> */}

      <BotaoHome
        onPress={() => navigation.navigate('GuiaDeConfirmacao')}
        title='Guias de Confirmação'
        text='Confirme pesagens, barco e documentos para realizar envios'
        src={require('../../assets/icons/check.png')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    paddingTop: 50,
    paddingRight: 24,
    paddingBottom: 58.275,
    paddingLeft: 24,
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    height: '100%'
  },

  containerUser: {
    width: 70,
    height: 70,
    padding: 28,
    alignItems: 'center',
    borderRadius: 35,
    backgroundColor: '#200393',
    marginTop: 50,
    marginBottom: 17
  },

  title: {
    alignSelf: 'stretch',
    color: '#2C205E',
    fontFamily: 'Inter-Black', // Corrigido o nome da fonte
    fontSize: 33, // Ajuste o tamanho conforme necessário
    fontStyle: 'normal',
    fontWeight: '700',
  },

  text: {
    color: '#4B465E',
    fontFamily: 'Inter',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '300',
    marginBottom: 32
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
