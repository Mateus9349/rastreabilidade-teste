import React, { useContext, useEffect } from 'react';
import { Image, StyleSheet, ScrollView } from 'react-native';
import { ActivityIndicator, Surface, Text, useTheme } from 'react-native-paper';
import { Link } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import { RootStackParamList } from '../../navigation/types';
import { useCustomFonts } from '../../utils/fonts';
import { AuthContext } from '../../contexts/AuthContext';
import { useCriaComunidadesELagosBase } from '../../utils/useCriaComunidadesELagosBase';

import HomeOptionCard from './components/HomeOptionCard';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function Home({ navigation }: Props) {
  const theme = useTheme();
  const { criarBase } = useCriaComunidadesELagosBase();

  const { user } = useContext(AuthContext);
  const [fontsLoaded] = useCustomFonts();

  useEffect(() => {
    criarBase();
  }, []);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <Surface style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Link style={styles.profileLink} to="/User">
          <Surface
            mode="elevated"
            elevation={2}
            style={[
              styles.profileButton,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.outline,
              },
            ]}
          >
            <Image
              style={styles.profileImage}
              source={require('../../../assets/icons/user.png')}
            />
          </Surface>
        </Link>

        <Text
          variant="headlineLarge"
          style={[styles.title, { color: theme.colors.primary }]}
        >
          Olá, {user?.nome.trim().split(/\s+/)[0] || 'Usuário'}
        </Text>

        <Text
          variant="bodyMedium"
          style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
        >
          Selecione uma opção para começar
        </Text>

        <HomeOptionCard
          onPress={() => navigation.navigate('Pescas')}
          title="Pescas"
          description="Cadastre novas pescas e monitore pescas atuais"
          image={require('../../../assets/icons/peixe.png')}
        />

        <HomeOptionCard
          onPress={() => navigation.navigate('Comunidades')}
          title="Comunidades"
          description="Cadastre novas comunidades e modifique as já cadastradas"
          icon={
            <MaterialCommunityIcons
              name="home-group"
              size={28}
              color={theme.colors.onPrimary}
            />
          }
        />

        <HomeOptionCard
          onPress={() => navigation.navigate('Lagos')}
          title="Lagos"
          description="Cadastre novos lagos e modifique os já cadastrados"
          icon={
            <FontAwesome5
              name="water"
              size={24}
              color={theme.colors.onPrimary}
            />
          }
        />

        <HomeOptionCard
          onPress={() => navigation.navigate('GuiaDeTransporte')}
          title="Enviar Barco"
          description="Realize envios dos pescados através dos barcos"
          image={require('../../../assets/icons/enviar.png')}
        />
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingTop: 72,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  profileLink: {
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  profileButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 38,
    height: 38,
    resizeMode: 'contain',
  },
  title: {
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 28,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});