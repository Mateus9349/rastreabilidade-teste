import React, { useContext, useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
    Alert,
    TouchableWithoutFeedback,
    ImageBackground,
} from "react-native";
import { Button } from "react-native-elements";
import { gerarEPDFDownloadExpo } from "../../utils/gerarPDFGuiaDeTransporte";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as peixeSchema from "../../database/schemas/peixeSchema";
import * as loteSchema from "../../database/schemas/loteSchema";
import { eq } from "drizzle-orm";
import { ILote } from "../../interfaces/Lote";
import { AuthContext } from "../../contexts/AuthContext";
import { useEnviarLoteCompleto } from "../../hooks/lote/useEnviarLoteCompleto";

export default function CardGuiaDeTransporte({
    lotes,
    remove,
}: {
    lotes: Object[] | undefined;
    remove: (id: number) => void;
}) {
    const { user } = useContext(AuthContext);

    // *** Crie o db ANTES de instanciar o hook que vai usá-lo ***
    const database = useSQLiteContext();
    const db = drizzle(database, { schema: peixeSchema });

    const { enviarLoteCompleto, loadingEnviar } = useEnviarLoteCompleto({
        createdBy: user?.nome ?? user?.email ?? "",
        chunkSize: 50,
        defaultsPeixe: { especie: "Pirarucu", unidade: "1", status: "PENDING" },
        resolvePeixeByLacre: async (lacre) => {
            // Buscar peixe localmente quando vier só o lacre
            const peixe = await db.query.peixe.findFirst({
                where: (tbl, { eq }) => eq(tbl.lacre, String(lacre)),
            });
            return peixe as any; // IPeixe | null
        },
    });

    const [gerarPDFLoading, setGerarPDFLoading] = useState<boolean>(true);
    const [loteEnviado, setLoteEnviado] = useState<boolean>(false);

    useEffect(() => {
        // opcional: efeitos relacionados aos lotes
    }, [lotes]);

    async function getPeixesDoLote(lote: ILote) {
        try {
            const todosPeixes = await db.query.peixe.findMany();

            const lotePeixes = typeof lote.peixes === "string" ? JSON.parse(lote.peixes) : lote.peixes;

            const peixesFiltrados = todosPeixes.filter((peixe) =>
                (lotePeixes ?? []).includes(peixe.lacre?.toString())
            );

            return peixesFiltrados;
        } catch (error) {
            console.error("Erro ao buscar peixes do lote:", error);
            throw error;
        }
    }

    async function fetchPeixesDoLote(lote: ILote) {
        try {
            setGerarPDFLoading(false);
            const peixesFiltrados = await getPeixesDoLote(lote);
            await gerarEPDFDownloadExpo({ peixes: peixesFiltrados, lote });
        } catch (error) {
            console.error("Erro ao gerar o PDF:", error);
        } finally {
            setGerarPDFLoading(true);
        }
    }

    const enviaBarco = async (lote: ILote) => {
        if (user?.permissoes.find((p) => p === "FAS_ADMIN")) {
            try {
                const { loteId } = await enviarLoteCompleto(lote); // cria lote sem peixes + envia peixes em batches
                await desativaLote(lote.id);
                setLoteEnviado(true);
            } catch (error) {
                Alert.alert("Erro ao enviar barco: " + error);
            }
        } else {
            Alert.alert("Você não tem permissão para enviar dados ao banco");
        }
    };

    const desativaLote = async (id: number | undefined) => {
        if (id === undefined || id === 0) {
            Alert.alert("Erro", "ID inválido.");
            return;
        }

        try {
            await db.update(loteSchema.lote).set({ ativo: 0 }).where(eq(loteSchema.lote.id, id));
        } catch (error) {
            Alert.alert("Erro ao atualizar o lote no banco interno: " + error);
        }
    };

    return (
        <>
            {loteEnviado ? (
                <TouchableWithoutFeedback onPress={() => setLoteEnviado(false)}>
                    <ImageBackground
                        source={require("../../../assets/img/fundoLoteEnviado.png")}
                        style={styles.containerImage}
                        resizeMode="cover"
                    >
                        <View style={styles.containerTextBtn}>
                            <View style={styles.containerText}>
                                <Text style={styles.mainText}>Lote Enviado</Text>
                                <Text style={styles.secundaryText}>Seu lote foi enviado com êxito</Text>
                            </View>

                            <Button
                                title={"Continuar"}
                                buttonStyle={{ backgroundColor: "#871B21" }}
                                onPress={() => setLoteEnviado(false)}
                            />
                        </View>
                    </ImageBackground>
                </TouchableWithoutFeedback>
            ) : (
                <ScrollView contentContainerStyle={{ alignItems: "center", marginTop: 15, marginBottom: 15 }}>
                    {lotes?.map((lote: any, index: number) => (
                        <View key={index} style={styles.container}>
                            <View>
                                <Text style={styles.title}>{lote.barco}</Text>
                                <Text style={styles.text}>Barco</Text>
                            </View>

                            <View>
                                <Text style={styles.title}>
                                    {lote.data ? new Date(lote.data).toLocaleDateString() : "Data"}
                                </Text>
                                <Text style={styles.text}>Data de Cadastro</Text>
                            </View>

                            <View>
                                <Text style={styles.title}>{`${lote.pesoTotal} Kg` || "Peso"}</Text>
                                <Text style={styles.text}>Peso</Text>
                            </View>

                            <View style={styles.btnContainer}>
                                <TouchableOpacity
                                    style={styles.btn1}
                                    onPress={() => !loadingEnviar && enviaBarco(lote)}
                                    onLongPress={() => remove(lote.id)}
                                    disabled={loadingEnviar}
                                >
                                    <Image source={require("../../../assets/icons/enviarBarco.png")} />
                                    <Text style={styles.btnText1}>{loadingEnviar ? "Enviando..." : "Enviar"}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.btn2} onPress={() => fetchPeixesDoLote(lote)}>
                                    <Image source={require("../../../assets/icons/download.png")} />
                                    <Text style={styles.btnText2}>{gerarPDFLoading ? "Baixar Guia" : "Carregando..."}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "space-between",
        height: 260,
        width: "80%",
        marginBottom: 24,
        paddingTop: 30,
        padding: 10,
        borderWidth: 0.5,
        borderRadius: 20,
        borderColor: "#BBBBBB",
    },
    title: {
        fontSize: 18,
        fontWeight: "800",
        color: "#FFFFFF",
    },
    text: {
        color: "#EDF2FD",
    },
    btnContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
        marginTop: 10,
    },
    btn1: {
        flexDirection: "row",
        backgroundColor: "#871B21",
        justifyContent: "center",
        alignItems: "center",
        height: 35,
        width: 135,
        borderRadius: 10,
    },
    btnText1: {
        color: "white",
        marginLeft: 8,
    },
    btn2: {
        flexDirection: "row",
        backgroundColor: "none",
        justifyContent: "center",
        alignItems: "center",
        height: 35,
        width: 135,
        borderWidth: 0.2,
        borderColor: "#EDF2FD",
        borderRadius: 10,
    },
    btnText2: {
        color: "#BBBBBB",
        marginLeft: 8,
    },

    containerImage: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        width: "100%",
        height: "100%",
    },
    containerTextBtn: {
        width: "101%",
        height: "38%",
        justifyContent: "flex-end",
        padding: 30,
        borderWidth: 0.5,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        borderColor: "#BBBBBB",
    },
    containerText: {
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 85,
        gap: 5,
    },
    mainText: {
        fontSize: 24,
        color: "#FFFFFF",
    },
    secundaryText: {
        fontSize: 14,
        color: "#BBBBBB",
    },
});
