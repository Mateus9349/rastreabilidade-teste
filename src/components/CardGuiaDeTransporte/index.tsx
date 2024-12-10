import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from "react-native";
import { gerarEPDFDownloadExpo } from "../../utils/gerarPDFGuiaDeTransporte";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as peixeSchema from '../../database/schemas/peixeSchema';
import * as loteSchema from '../../database/schemas/loteSchema';
import { useEffect, useState } from "react";
import { eq } from "drizzle-orm";
import { ILote } from "../../interfaces/Lote";
import { useCriarLote } from "../../hooks/lote/useCriarLote";
import { IPeixe } from "../../interfaces/Peixe";
import { useCriarPeixe } from "../../hooks/peixe/useCriarPeixe";

export default function CardGuiaDeTransporte({ lotes, remove }: { lotes: Object[] | undefined; remove: (id: number) => void }) {
    const { criarLote, loading, error } = useCriarLote();
    const { criarPeixe } = useCriarPeixe();

    const database = useSQLiteContext();
    const db = drizzle(database, { schema: peixeSchema });

    useEffect(() => {
        
    }, [lotes]);

    async function getPeixesDoLote(lote: ILote) {
        try {
            // Buscar todos os peixes do banco de dados
            const todosPeixes = await db.query.peixe.findMany();
    
            // Garantir que lote.peixes é um array de lacres
            const lotePeixes = typeof lote.peixes === 'string' 
                ? JSON.parse(lote.peixes) 
                : lote.peixes;
    
            // Filtrar peixes que pertencem ao lote
            const peixesFiltrados = todosPeixes.filter(peixe =>
                lotePeixes.includes(peixe.lacre.toString())
            );
    
            return peixesFiltrados;
        } catch (error) {
            console.error("Erro ao buscar peixes do lote:", error);
            throw error; // Re-throw para que o erro seja capturado na função fetchPeixesDoLote
        }
    }
    
    async function fetchPeixesDoLote(lote: ILote) {
        try {
            const peixesFiltrados = await getPeixesDoLote(lote);
            await gerarEPDFDownloadExpo({ peixes: peixesFiltrados, lote });
        } catch (error) {
            console.error("Erro ao gerar o PDF:", error);
        }
    }
    

    const enviaBarco = async (lote: ILote) => {
        try {
            // Verifica se `lote.peixes` é uma string e a converte para um array
            /* const peixes = typeof lote.peixes === 'string'
                ? JSON.parse(lote.peixes).map(Number)
                : [];

            const peixesNoLote = await getPeixesDoLote(lote);
            for (const peixe of peixesNoLote) {
                await criarPeixe(peixe);
            } */



            //await criarLote(lote);
            await desativaLote(lote.id);
            //adicionar situação do lote como enviado para salgadeira ou não confirmado na salgadeira
            Alert.alert('Informações enviadas a salgadeira!');
        } catch (error) {
            Alert.alert('Error ao enviar barco: ' + error);
        }
    }

    const desativaLote = async (id: number | undefined) => {
        if (id === undefined || id === 0) {
            // Exibir uma mensagem de erro ou não fazer nada
            Alert.alert("Erro", "ID inválido.");
            return;
        }

        try {
            await db.update(loteSchema.lote).set({ ativo: 0 }).where(eq(loteSchema.lote.id, id));
        } catch (error) {
            Alert.alert("Error ao atualizar o lote no banco interno: " + error);
        }
    }



    return (
        <ScrollView
            contentContainerStyle={{ alignItems: 'center', marginTop: 15, marginBottom: 15 }}
        >
            {lotes?.map((lote: any, index: number) => (
                <View key={index} style={styles.container}>
                    <View>
                        <Text style={styles.title}>{lote.barco}</Text>
                        <Text style={styles.text}>Barco</Text>
                    </View>

                    <View>
                        <Text style={styles.title}>{new Date(lote.data).toLocaleDateString() || "Data"}</Text>
                        <Text style={styles.text}>Data de Cadastro</Text>
                    </View>

                    <View>
                        <Text style={styles.title}>{`${lote.pesoTotal} Kg` || "Peso"}</Text>
                        <Text style={styles.text}>Peso</Text>
                    </View>

                    <View style={styles.btnContainer}>
                        <TouchableOpacity
                            style={styles.btn1}
                            onPress={() => enviaBarco(lote)}
                            onLongPress={() => remove(lote.id)}
                        >
                            <Image source={require('../../../assets/icons/enviarBarco.png')} />
                            <Text style={styles.btnText1}>Enviar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.btn2}
                            onPress={() => fetchPeixesDoLote(lote)}
                        >
                            <Image source={require('../../../assets/icons/download.png')} />
                            <Text style={styles.btnText2}>Baixar Guia</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        height: 260, // Ajuste conforme necessário
        width: '80%',
        marginBottom: 24,
        backgroundColor: '#F1F5FF',
        paddingTop: 30,
        padding: 10,
        borderRadius: 20
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        color: '#2C205E'
    },
    text: {
        color: '#2C205E',
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        marginTop: 10
    },
    btn1: {
        flexDirection: 'row',
        backgroundColor: '#200393',
        justifyContent: 'center',
        alignItems: 'center',
        height: 35,
        width: 135,
        borderRadius: 10
    },
    btnText1: {
        color: 'white',
        marginLeft: 8
    },
    btn2: {
        flexDirection: 'row',
        backgroundColor: 'none',
        justifyContent: 'center',
        alignItems: 'center',
        height: 35,
        width: 135,
        borderWidth: 1,
        borderColor: '#2C205E',
        borderRadius: 10
    },
    btnText2: {
        color: '#2C205E',
        marginLeft: 8
    },
});
