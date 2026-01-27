import { Alert, ScrollView, StyleSheet, View } from "react-native";
import InputText from "../InputText";
import { useEffect, useState } from "react";
import DateInput from "../DataInput";
import { IPeixe } from "../../interfaces/Peixe";
import Botao from "../Botao";
import { ILote } from "../../interfaces/Lote";
import React from "react";

export default function FormLote({ peixes, post }: { peixes: IPeixe[]; post: (lote: ILote) => void; }) {
    const [lote, setLote] = useState<ILote>({
        planilha: 0,
        comunidade: '',
        setor: '',
        assistente: '',
        barco: '',
        data: new Date(),
        apetrechos: '',
        ambiente: '',
        quantidade: 0,
        quantidadeF: 0,
        quantidadeM: 0,
        pesoTotal: 0,
        peixes: [],
    });

    useEffect(() => {
        const quantidadeFemeas = peixes.filter(peixe => peixe.sexo === 'F').length;
        const quantidadeMachos = peixes.filter(peixe => peixe.sexo === 'M').length;
        const quantidadeTotal = peixes.length;
        const pesoTotal = peixes.reduce((acc, peixe) => acc + Number(peixe.peso), 0);
        const lacres = peixes.map(peixe => peixe.lacre);

        handleChange('quantidade', quantidadeTotal);
        handleChange('quantidadeF', quantidadeFemeas);
        handleChange('quantidadeM', quantidadeMachos);
        handleChange('pesoTotal', pesoTotal);
        handleChange('peixes', lacres);
    }, [peixes]);

    const handleChange = (field: keyof ILote, value: string | number | Date | string[]) => {
        setLote((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <ScrollView style={{ flex: 1, gap: 16, padding: 20 }}>
            <View style={styles.horizontal}>
                <View style={styles.input}>
                    <InputText
                        label="Assistente"
                        placeholder="ex: João da Silva"
                        value={lote.assistente}
                        onChangeText={(text) => handleChange("assistente", text)}
                    />
                </View>

                <View style={styles.input}>
                    <InputText
                        label="Setor"
                        placeholder="ex: Setor 1"
                        value={lote.setor}
                        onChangeText={(text) => handleChange("setor", text)}
                    />
                </View>
            </View>

            <View style={styles.horizontal}>
                <View style={styles.input}>
                    <InputText
                        label="Ambiente"
                        placeholder="ex: Rio, Lago"
                        value={lote.ambiente}
                        onChangeText={(text) => handleChange("ambiente", text)}
                    />
                </View>

                <View style={styles.input}>
                    <InputText
                        label="Apetrechos"
                        placeholder="ex: Rede de arrasto"
                        value={lote.apetrechos}
                        onChangeText={(text) => handleChange("apetrechos", text)}
                    />
                </View>
            </View>

            <View style={styles.horizontal}>
                <View style={styles.input}>
                    <InputText
                        label="Barco"
                        placeholder="ex: Mangueira"
                        value={lote.barco}
                        onChangeText={(text) => handleChange("barco", text)}
                    />
                </View>

                <View style={styles.input}>
                    <InputText
                        label="Destino"
                        placeholder="ex: Salgadeira"
                        value={lote.comunidade}
                        onChangeText={(text) => handleChange("comunidade", text)}
                    />
                </View>
            </View>

            <View style={styles.horizontal}>
                <View style={styles.input}>
                    <InputText
                        label="Quantidade"
                        placeholder="Quantidade"
                        value={String(lote.quantidade)}
                        pointerEvents="none" // Desabilita a interação
                    />
                </View>

                <View style={styles.input}>
                    <InputText
                        label="Peso Total"
                        placeholder="Peso total"
                        value={String(lote.pesoTotal)}
                        pointerEvents="none" // Desabilita a interação
                    />
                </View>
            </View>

            <View style={styles.horizontal}>
                <View style={styles.input}>
                    <InputText
                        label="Quantidade Fêmeas"
                        placeholder="Quantidade de fêmeas"
                        value={String(lote.quantidadeF)}
                        pointerEvents="none" // Desabilita a interação
                    />
                </View>

                <View style={styles.input}>
                    <InputText
                        label="Quantidade Machos"
                        placeholder="Quantidade de machos"
                        value={String(lote.quantidadeM)}
                        pointerEvents="none" // Desabilita a interação
                    />
                </View>
            </View>

            <DateInput
                label="Data"
                value={lote.data}
                onChange={(date) => handleChange("data", date)}
            />

            <Botao
                text="Finalizar lote"
                onPress={() => {
                    if (
                        lote.assistente !== '' &&
                        lote.apetrechos !== '' &&
                        lote.barco !== '' &&
                        lote.ambiente !== '' &&
                        lote.quantidade > 0 &&
                        lote.pesoTotal > 0 &&
                        lote.quantidadeF >= 0 &&
                        lote.quantidadeM >= 0 &&
                        lote.data !== null
                    ) {
                        post(lote); // Envia os dados para a memoria interna
                    } else {
                        Alert.alert('Preencha todos os campos obrigatórios!');
                    }
                }}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    horizontal: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 12
    },
    input: {
        flex: 1,
        marginHorizontal: 8,
    },
});
