import { StyleSheet, Text, View } from "react-native";
import InputText from "../InputText";
import { useEffect, useState } from "react";
import { IPeixe } from "../../types/Peixe";

interface Props {
    peixes: IPeixe[];
    intervaloLacres: (inicio: number, fim: number) => void;
}

export default function SelecionaPeixes({ peixes, intervaloLacres }: Props) {
    const [inicio, setInicio] = useState<number>(0);
    const [fim, setFim] = useState<number>(0);

    // Chama a função intervaloLacres sempre que o estado de fim ou início mudar
    useEffect(() => {
        intervaloLacres(inicio, fim);
    }, [inicio, fim]); // Adicionando 'inicio' também para ser monitorado

    return (
        <View style={styles.container}>

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.title}>Selecione o intervalo de lacres</Text>
            </View>

            <View style={styles.containerInputs}>
                <View style={styles.input}>
                    <InputText
                        label="De"
                        placeholder="início do intervalo"
                        value={String(inicio)}
                        onChangeText={(value) => setInicio(Number(value))}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.input}>
                    <InputText
                        label="Até"
                        placeholder="fim do intervalo"
                        value={String(fim)}
                        onChangeText={(value) => setFim(Number(value))}
                        keyboardType="numeric"
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20 // Adicionando margem inferior para espaçamento
    },

    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2C205E',
        marginBottom: 24,
        marginTop: 24
    },

    containerInputs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    input: {
        width: '47%'
    },
});
