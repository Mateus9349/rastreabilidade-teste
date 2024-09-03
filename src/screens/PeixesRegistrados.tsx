import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { useEffect, useState } from "react";
import { IPeixe } from "../types/Peixe";
import { Alert, FlatList, Pressable, Text } from "react-native";


import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as peixeSchema from '../database/schemas/peixeSchema';
import { eq } from "drizzle-orm";

type Props = NativeStackScreenProps<RootStackParamList, 'PeixesRegistrados'>;

export default function PeixesRegistrados({ navigation }: Props) {
    const [peixes, setPeixes] = useState<IPeixe[]>([]);

    const database = useSQLiteContext();
    const db = drizzle(database, { schema: peixeSchema });

    async function fetchPeixes() {
        try {
            const response = await db.query.peixe.findMany();
            setPeixes(response)
        } catch (error) {
            console.log(error)
        }
    }

    async function remove(id: number | undefined) {
        if (id === undefined || id === 0) {
            // Exibir uma mensagem de erro ou não fazer nada
            Alert.alert("Erro", "ID inválido.");
            return;
        }

        try {
            Alert.alert("Remover", "Deseja remover?", [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Sim",
                    onPress: async () => {
                        try {
                            await db
                                .delete(peixeSchema.peixe)
                                .where(eq(peixeSchema.peixe.id, id)); // Ajuste conforme a sintaxe correta da Drizzle ORM

                            await fetchPeixes();
                        } catch (error) {
                            console.log(error);
                        }
                    },
                },
            ]);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchPeixes()
    }, [])

    return <>
        <FlatList
            data={peixes}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
                <Pressable
                    style={{ padding: 16, borderWidth: 1, borderRadius: 7 }}
                    onLongPress={() => remove(item.id)}
                >
                    <Text>{item.lacre}</Text>
                </Pressable>
            )}
            ListEmptyComponent={() => <Text>Lista vazia.</Text>}
            contentContainerStyle={{ gap: 16 }}
        />
    </>
}