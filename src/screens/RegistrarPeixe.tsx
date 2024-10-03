import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, Text, Button, Alert, ScrollView } from "react-native";
import { RootStackParamList } from "../navigation/types";
import FormPeixe from "../components/FormPeixe";
import { IPeixe } from "../types/Peixe";

import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as peixeSchema from '../database/schemas/peixeSchema';

type Props = NativeStackScreenProps<RootStackParamList, 'RegistrarPeixe'>;

export default function RegistrarPeixe({ navigation }: Props) {
    const database = useSQLiteContext();
    const db = drizzle(database, { schema: peixeSchema });

    const registrarPeixe = async (dados: IPeixe) => {
        console.log("Dados salvos com sucesso:", dados);
        try {
            const response = await db.insert(peixeSchema.peixe).values(dados);
            Alert.alert("Cadastrado com o ID: " + response.lastInsertRowId);
        } catch (error) {
            console.error("Erro ao cadastrar o peixe:", error);
            Alert.alert("Erro", "Não foi possível cadastrar o peixe. Tente novamente.");
        }
    };

    return (
        <View style={{ flex: 1, width: '100%' }}>
            <FormPeixe onSubmit={registrarPeixe} />
        </View>
    );
}


