import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useCustomFonts } from '../utils/fonts';
import BotaoHome from '../components/BotaoHome';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from '@react-navigation/native';
import BotaoHomeSlot from '../components/BotaoHomeSlot/BotaoHomeSlot';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useCriaComunidadesELagosBase } from '../utils/useCriaComunidadesELagosBase';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { criarBase } = useCriaComunidadesELagosBase();

  const { user, logout } = useContext(AuthContext);
  const [fontsLoaded] = useCustomFonts();

  useEffect(() => {
    // Cria comunidades base ao montar o componente
    criarBase();
  }, []);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Link style={styles.containerUser} to="/User">
        <Image style={styles.img} source={require('../../assets/icons/user.png')} />
      </Link>

      <Text style={styles.title}>Olá, {user?.nome.trim().split(/\s+/)[0] || "Usuário"}</Text>

      <Text style={styles.text}>Selecione uma opção para começar</Text>

      <BotaoHome
        onPress={() => navigation.navigate('Pescas')}
        title='Pescas'
        text='Cadastre novas pescas e monitore pescas atuais'
        src={require('../../assets/icons/peixe.png')}
      />

      {/* <BotaoHome
        onPress={() => navigation.navigate('GuiaDeConfirmacao')}
        title='Guias de Confirmação'
        text='Confirme pesagens, barco e documentos para realizar envios'
        src={require('../../assets/icons/check.png')}
      /> */}

      <BotaoHomeSlot
        onPress={() => navigation.navigate('Comunidades')}
        title='Comunidades'
        text='Cadastre novas comunidades e modifique as já cadastradas'
      >
        <MaterialCommunityIcons name="home-group" size={34} color="white" />
      </BotaoHomeSlot>

      <BotaoHomeSlot
        onPress={() => navigation.navigate('Lagos')}
        title='Lagos'
        text='Cadastre novos lagos e modifique os já cadastrados'
      >
        <FontAwesome5 name="water" size={34} color="white" />
      </BotaoHomeSlot>

      <BotaoHome
        onPress={() => navigation.navigate('GuiaDeTransporte')}
        title='Enviar Barco'
        text='Realize envios dos pescados através dos barcos'
        src={require('../../assets/icons/enviar.png')}
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
    height: '100%',
  },
  containerUser: {
    width: 70,
    height: 70,
    padding: 12,
    alignItems: 'center',
    borderRadius: 35,
    marginTop: 50,
    marginBottom: 17,
    backgroundColor: '#871B21',
    borderColor: '#D4A85B',
    borderWidth: 2
  },

  img: {
    width: 320
  },

  title: {
    alignSelf: 'stretch',
    color: '#F9F9F9',
    fontFamily: 'Inter-Black',
    fontSize: 33,
    fontStyle: 'normal',
    fontWeight: '700',
  },

  text: {
    color: '#F9F9F9',
    fontFamily: 'Inter',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '300',
    marginBottom: 32,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
