import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { useEffect, useState } from "react";
import { IPeixe } from "../types/Peixe";
import { FlatList, Pressable, Text } from "react-native";


import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as peixeSchema from '../database/schemas/peixeSchema';

type Props = NativeStackScreenProps<RootStackParamList, 'PeixesRegistrados'>;

export default function PeixesRegistrados({ navigation }: Props) {
    const [peixes, setPeixes] = useState<IPeixe[]>([]);

    const database = useSQLiteContext();
    const db = drizzle(database, { schema: peixeSchema });

    async function fetchPeixe() {
        try {
            const response = await db.query.peixe.findMany();
            setPeixes(response)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchPeixe()
    }, [peixes]);

    return <>
        <FlatList
            data={peixes}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
                <Pressable
                    style={{ padding: 16, borderWidth: 1, borderRadius: 7 }}
                >
                    <Text>{item.lacre}</Text>
                </Pressable>
            )}
            ListEmptyComponent={() => <Text>Lista vazia.</Text>}
            contentContainerStyle={{ gap: 16 }}
        />
    </>
}