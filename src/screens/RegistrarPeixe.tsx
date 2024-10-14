import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, Image, StyleSheet, Alert, TouchableWithoutFeedback } from "react-native";
import { RootStackParamList } from "../navigation/types";
import FormPeixe from "../components/FormPeixe";
import { IPeixe } from "../types/Peixe";

import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as peixeSchema from '../database/schemas/peixeSchema';
import { useState } from "react";

type Props = NativeStackScreenProps<RootStackParamList, 'RegistrarPeixe'>;

export default function RegistrarPeixe({ navigation }: Props) {
    const [pescaRegistrada, setPescaRegistrada] = useState<boolean>(false);

    const database = useSQLiteContext();
    const db = drizzle(database, { schema: peixeSchema });

    const registrarPeixe = async (dados: IPeixe) => {
        try {
            const response = await db.insert(peixeSchema.peixe).values(dados);
            setPescaRegistrada(true);
        } catch (error) {
            console.error("Erro ao cadastrar o peixe:", error);
            Alert.alert("Erro", "Não foi possível cadastrar o peixe. Tente novamente.");
        }
    };

    return (
        <View style={{ flex: 1, width: '100%' }}>
            {pescaRegistrada ? (
                <TouchableWithoutFeedback onPress={() => setPescaRegistrada(false)}>
                    <View style={styles.containerImage}>
                        <Image style={styles.img} source={require('../../assets/img/pescaRegistrada.png')} />
                    </View>
                </TouchableWithoutFeedback>
            ) : (
                <FormPeixe onSubmit={registrarPeixe} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    containerImage: {
        flex: 1, // Faz o container ocupar o espaço disponível
        justifyContent: 'center', // Centraliza verticalmente
        alignItems: 'center', // Centraliza horizontalmente
        position: 'absolute',
        width: '100%', // Para garantir que o container ocupe toda a largura
        height: '100%', // Para garantir que o container ocupe toda a altura
    },
    img: {
        width: 150,
        height: 150,
    },
});



