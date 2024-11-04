import { Alert, Button, ScrollView, StyleSheet, View } from "react-native";
import InputText from "../InputText";
import { useEffect, useState } from "react";
import DateInput from "../DataInput";
import { IPeixe } from "../../types/Peixe";
import SelecionaPeixes from "../SelecionaPeixes";
import Botao from "../Botao";

export default function FormLote({ peixes, post }: { peixes: IPeixe[]; post: (lote: ILote) => void; }) {
    const [click, setClick] = useState<boolean>(true);
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
        peixes: []
    });

    const handleChange = (field: keyof ILote, value: string | number | Date | string[]) => {
        setLote((prev) => ({ ...prev, [field]: value }));
    };

    const handleIntervaloDeLacres = (inicio: number, fim: number) => {
        const peixesFiltrados = peixes.filter(peixe => {
            const lacreNumber = peixe.ativo === 1 ?  Number(peixe.lacre): -1; // Converte o lacre para number
            return lacreNumber >= inicio && lacreNumber <= fim;
        });

        const quantidadeFemeas = peixesFiltrados.filter(peixe => peixe.sexo === 'F').length;
        const quantidadeMachos = peixesFiltrados.filter(peixe => peixe.sexo === 'M').length;
        const quantidadeTotal = peixesFiltrados.length;
        const pesoTotal = peixesFiltrados.reduce((acc, peixe) => acc + Number(peixe.peso), 0);
        const lacres = peixesFiltrados.map(peixe => peixe.lacre);

        handleChange('quantidade', quantidadeTotal);
        handleChange('quantidadeF', quantidadeFemeas);
        handleChange('quantidadeM', quantidadeMachos);
        handleChange('pesoTotal', pesoTotal);
        handleChange('peixes', lacres);
    };

    const handleNextForm = () => {
        if (lote.planilha && lote.comunidade && lote.setor !== '') {
            setClick(false);
        } else {
            Alert.alert('Preencha todos os campos!');
        }
    }

    return (
        <ScrollView style={{ flex: 1, gap: 16, padding: 20 }}>
            {click ?
                <>
                    <SelecionaPeixes peixes={peixes} intervaloLacres={handleIntervaloDeLacres} />

                    <View style={{ flex: 1, gap: 16 }}>
                        <InputText
                            label="Planilha"
                            placeholder="Digite o número da planilha"
                            value={String(lote.planilha)}
                            onChangeText={(text) => handleChange("planilha", Number(text))}
                            keyboardType="numeric"
                        />

                        <InputText
                            label="Comunidade"
                            placeholder="Digite a comunidade"
                            value={lote.comunidade}
                            onChangeText={(text) => handleChange("comunidade", text)}
                        />

                        <InputText
                            label="Setor"
                            placeholder="Digite o setor"
                            value={lote.setor}
                            onChangeText={(text) => handleChange("setor", text)}
                        />

                        <Botao text="Continuar" onPress={handleNextForm} />
                    </View>
                </>
                :
                <>
                    <View style={styles.horizontal}>
                        <View style={styles.input}>
                            <InputText
                                label="Assistente"
                                placeholder="Digite o nome do assistente"
                                value={lote.assistente}
                                onChangeText={(text) => handleChange("assistente", text)}
                            />
                        </View>

                        <View style={styles.input}>
                            <InputText
                                label="Apetrechos"
                                placeholder="Digite o tipo de apetrechos"
                                value={lote.apetrechos}
                                onChangeText={(text) => handleChange("apetrechos", text)}
                            />
                        </View>
                    </View>

                    <View style={styles.horizontal}>
                        <View style={styles.input}>
                            <InputText
                                label="Barco"
                                placeholder="Digite o nome do barco"
                                value={lote.barco}
                                onChangeText={(text) => handleChange("barco", text)}
                            />
                        </View>

                        <View style={styles.input}>
                            <InputText
                                label="Ambiente"
                                placeholder="Digite o tipo de ambiente"
                                value={lote.ambiente}
                                onChangeText={(text) => handleChange("ambiente", text)}
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
                                post(lote); // Envia os dados do lote
                            } else {
                                Alert.alert('Preencha todos os campos obrigatórios!');
                            }
                        }}
                    />
                </>
            }
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {

    },

    horizontal: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    input: {
        flex: 1,
        marginHorizontal: 8,
    },
})
