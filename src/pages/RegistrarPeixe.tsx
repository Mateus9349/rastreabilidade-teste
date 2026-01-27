import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, Image, StyleSheet, Alert, TouchableWithoutFeedback, ImageBackground, Text } from "react-native";
import { RootStackParamList } from "../navigation/types";
import FormPeixe from "../components/FormPeixe";
import { IPeixe } from "../interfaces/Peixe";

import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as peixeSchema from '../database/schemas/peixeSchema';
import { useState } from "react";
import { Button } from "react-native-elements";

type Props = NativeStackScreenProps<RootStackParamList, 'RegistrarPeixe'>;

export default function RegistrarPeixe({ navigation }: Props) {
    const [pescaRegistrada, setPescaRegistrada] = useState<boolean>(false);

    const database = useSQLiteContext();
    const db = drizzle(database, { schema: peixeSchema });

    const registrarPeixe = async (dados: IPeixe) => {
        try {
            const peixesRegistrados: IPeixe[] = await db.query.peixe.findMany();
            const lacreExistente = peixesRegistrados.some(peixe => peixe.lacre === dados.lacre);

            if (lacreExistente) {
                Alert.alert('Já existe um pescado com este número de lacre!');
            } else {
                await db.insert(peixeSchema.peixe).values(dados);
                setPescaRegistrada(true);
            }
        } catch (error) {
            console.error("Erro ao cadastrar o peixe:", error);
            Alert.alert("Erro", "Não foi possível cadastrar o peixe. Tente novamente.");
        }
    };

    return (
        <View style={{ flex: 1, width: '100%' }}>
            {
                pescaRegistrada ? (
                    <TouchableWithoutFeedback onPress={() => setPescaRegistrada(false)}>
                        <ImageBackground
                            source={require('../../assets/img/fundoPescaRegistrada.png')}
                            style={styles.containerImage}
                            resizeMode="cover"
                        >
                            <View style={styles.containerTextBtn}>
                                <View style={styles.containerText}>
                                    <Text style={styles.mainText}>Pesca Registrada</Text>
                                    <Text style={styles.secundaryText}>Sua pesca foi resgistrada com êxito</Text>
                                </View>

                                <Button
                                    title={'Continuar'}
                                    buttonStyle={{ backgroundColor: '#871B21' }}
                                    onPress={() => setPescaRegistrada(false)}
                                />
                            </View>
                        </ImageBackground>
                    </TouchableWithoutFeedback>
                ) : (
                    <FormPeixe onSubmit={registrarPeixe} />
                )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    containerImage: {
        flex: 1, // Faz o container ocupar o espaço disponível
        justifyContent: 'flex-end', // Centraliza verticalmente
        alignItems: 'center', // Centraliza horizontalmente
        width: '100%', // Para garantir que o container ocupe toda a largura
        height: '100%', // Para garantir que o container ocupe toda a altura
    },
    containerTextBtn: {
        width: '101%',
        height: '38%',
        justifyContent: 'flex-end',
        padding: 30,
        borderWidth: 0.5,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        borderColor: '#BBBBBB'
    },
    containerText: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 85,
        gap: 5,
    },
    mainText: {
        fontSize: 24,
        color: '#FFFFFF'
    },
    secundaryText: {
        fontSize: 14,
        color: '#BBBBBB'
    }
});



