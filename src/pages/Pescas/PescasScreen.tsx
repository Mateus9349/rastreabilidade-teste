import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, ScrollView } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';

import { RootStackParamList } from '../../navigation/types';
import HomeOptionCard from '../Home/components/HomeOptionCard';

type Props = NativeStackScreenProps<RootStackParamList, 'Pescas'>;

export default function PescasScreen({ navigation }: Props) {
  const theme = useTheme();

  return (
    <Surface style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text
          variant="headlineLarge"
          style={[styles.title, { color: theme.colors.primary }]}
        >
          Selecione a ação
        </Text>

        <Text
          variant="bodyMedium"
          style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
        >
          Selecione uma opção para começar
        </Text>

        <HomeOptionCard
          title="Cadastrar Nova Pesca"
          description="Cadastre novas pescas no aplicativo"
          image={require('../../../assets/icons/mais.png')}
          onPress={() => navigation.navigate('RegistrarPeixe')}
        />

        <HomeOptionCard
          title="Pescas Atuais"
          description="Visualize ou edite as pescas atuais"
          image={require('../../../assets/icons/anzol.png')}
          onPress={() => navigation.navigate('PeixesRegistrados')}
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
  title: {
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 28,
  },
});