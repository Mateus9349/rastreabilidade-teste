import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import { RootStackParamList } from "../navigation/types";
import BotaoPescas from "../components/BotaoPescas";

type Props = NativeStackScreenProps<RootStackParamList, 'Pescas'>;

export default function PescasScreen({ navigation }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Selecione a ação</Text>
            <Text style={styles.text}>Selecione uma opção para começar</Text>

            <View style={styles.containerBotoes}>
                <BotaoPescas
                    title="Cadastrar Nova Pesca"
                    text="Cadastre novas pescas no aplicativo"
                    src={require('../../assets/icons/Mais.png')}
                    OnPress={() => navigation.navigate('RegistrarPeixe')}
                />

                <BotaoPescas
                    title="Pescas Atuais"
                    text="Visualize ou edite as pescas atuais"
                    src={require('../../assets/icons/Anzol.png')}
                    OnPress={() => navigation.navigate('PeixesRegistrados')}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 60,
        width: 327,
        flexDirection: 'column',
        alignItems: 'flex-start',
        alignSelf: 'center',
    },
    title: {
        color: '#000000',
        fontFamily: 'Inter',
        fontSize: 19,
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: 22.8,
        marginBottom: 6
    },
    text: {
        color: '#000000',
        fontFamily: 'Inter',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '300',
        lineHeight: 19.2,
        marginBottom: 32
    },
    containerBotoes: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
})