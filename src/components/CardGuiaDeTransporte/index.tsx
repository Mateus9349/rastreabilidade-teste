import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from "react-native";
import { gerarEPDFDownloadExpo } from "../../types/ts/gerarPDFGuiaDeTransporte";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as peixeSchema from '../../database/schemas/peixeSchema';
import * as loteSchema from '../../database/schemas/loteSchema';
import { useEffect, useState } from "react";
import { eq } from "drizzle-orm";

export default function CardGuiaDeTransporte({ lotes, remove }: { lotes: Object[] | undefined; remove: (id: number) => void }) {

    const database = useSQLiteContext();
    const db = drizzle(database, { schema: peixeSchema });

    useEffect(() => {

    }, [lotes]);

    async function fetchPeixesDoLote(lote: ILote) {
        try {
            // Buscar todos os peixes do banco de dados
            const todosPeixes = await db.query.peixe.findMany();

            // Filtrar peixes que pertencem ao lote
            const peixesFiltrados = todosPeixes.filter(peixe =>
                lote.peixes.includes(peixe.lacre.toString())
            );

            await gerarEPDFDownloadExpo({ peixes: peixesFiltrados, lote });
        } catch (error) {
            console.log(error);
        }
    }

    const enviaBarco = async (lote: ILote) => {
        try {
            await desativaLote(lote.id);
            Alert.alert('Banco de dados em nuvem ainda não estão ativos!');
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
