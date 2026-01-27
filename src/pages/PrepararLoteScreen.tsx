import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as peixeSchema from "../database/schemas/peixeSchema";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Botao from "../components/Botao";
import FormLote from "../components/FormLote";
import { pegaPeixesSelecionados } from "../utils/pegaPeixesPorLacres";
import { IPeixe } from "../interfaces/Peixe";
import * as loteSchema from "../database/schemas/loteSchema";
import { useCriarLoteMemoriaInterna } from "../hooks/lote/useCriarLoteMemoriaInterna";
import { ILote } from "../interfaces/Lote";

type Props = NativeStackScreenProps<RootStackParamList, "PeixesRegistrados">;

export default function PrepararLoteScreen() {
    const database = useSQLiteContext();
    const db = drizzle(database, { schema: peixeSchema });
    const dbLote = drizzle(database, { schema: loteSchema });

    const [peixes, setPeixes] = useState<IPeixe[]>([]);
    const [selectedPeixes, setSelectedPeixes] = useState<string[]>([]);
    const [finalizar, setFinalizar] = useState<boolean>(false);
    const [peixesSelecionados, setPeixesSelecionados] = useState<IPeixe[]>([]);
    const { registrarLote } = useCriarLoteMemoriaInterna();

    useEffect(() => {
        fetchPeixes();
    }, []);

    useEffect(() => {
        if (finalizar) {
            fetchPeixesSelecionados();
        }
    }, [finalizar, selectedPeixes]);

    async function fetchPeixes() {
        try {
            const response = await db.query.peixe.findMany();
            const peixesAtivos = response.filter(item => item.ativo === 1);
            setPeixes(peixesAtivos);
        } catch (error) {
            console.error("Erro ao buscar peixes:", error);
        }
    }

    async function fetchPeixesSelecionados() {
        try {
            const peixesResult = await pegaPeixesSelecionados(db, selectedPeixes);
            setPeixesSelecionados(peixesResult);
        } catch (error) {
            console.error("Erro ao buscar peixes selecionados:", error);
        }
    }

    const toggleSelectPeixe = (lacre: string) => {
        setSelectedPeixes((prevSelected) =>
            prevSelected.includes(lacre)
                ? prevSelected.filter(item => item !== lacre)
                : [...prevSelected, lacre]
        );
    };

    const toggleSelectAll = () => {
        if (selectedPeixes.length === peixes.length) {
            setSelectedPeixes([]);
        } else {
            setSelectedPeixes(peixes.map(peixe => peixe.lacre));
        }
    };

    async function handleLote(lote: ILote) {
        await registrarLote(db, dbLote, lote, peixesSelecionados);
        fetchPeixes();
        setFinalizar(false);
    }

    return (
        <>
            {finalizar ? (
                <FormLote
                    peixes={peixesSelecionados}
                    post={handleLote}
                />
            ) : (
                <View style={styles.container}>
                    <Text style={styles.title}>Selecione os Peixes</Text>
                    <Button
                        title={selectedPeixes.length === peixes.length ? "Desmarcar Todos" : "Selecionar Todos"}
                        onPress={toggleSelectAll}
                        color="#FFC74E"
                    />

                    <FlatList
                        data={peixes}
                        keyExtractor={(item) => item.id?.toString() || ""}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.card,
                                    selectedPeixes.includes(item.lacre) && styles.selectedCard,
                                ]}
                                onPress={() => toggleSelectPeixe(item.lacre)}
                            >
                                <Image source={require('../../assets/icons/peixe.png')} />

                                <Text style={styles.cardText}>
                                    Lacre: {item.lacre}
                                </Text>

                                {selectedPeixes.includes(item.lacre) && (
                                    <MaterialIcons name="check-circle" size={24} color="#FFC74E" />
                                )}
                            </TouchableOpacity>
                        )}
                    />

                    {/* <Text style={styles.selectedLacresTitle}>Lacres Selecionados: {selectedPeixes.join(", ")}</Text> */}

                    <TouchableOpacity style={styles.button} onPress={() => setFinalizar(true)}>
                        <Text style={styles.cardText}>Formar lote</Text>
                    </TouchableOpacity>

                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        gap: 20
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 16,
    },
    card: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        marginBottom: 8,
        borderWidth: 0.2,
        borderColor: "#BBBBBB",
        borderRadius: 8,
    },
    selectedCard: {
        backgroundColor: "#871B21",
    },
    cardText: {
        fontSize: 16,
        color: "#BFC6D6",
    },
    selectedLacresTitle: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: "bold",
        color: "#BFC6D6",
    },
    selectedLacres: {
        marginTop: 8,
        fontSize: 16,
        color: "#FFC74E",
    },
    button: {
        height: 40,
        backgroundColor: '#871B21',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8
    }
});
