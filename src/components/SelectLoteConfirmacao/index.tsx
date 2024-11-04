import { TouchableOpacity, Text, StyleSheet, View, Image } from "react-native";

interface Lote {
    id: number;
    ambiente: string;
    apetrechos: string;
    assistente: string;
    barco: string;
    comunidade: string;
    data: string;
    peixes: string;
    pesoTotal: string;
    planilha: number;
    quantidade: number;
    quantidadeF: number;
    quantidadeM: number;
    setor: string;
}

interface Props {
    lotes: Lote[];
    selectLote: (lote: Lote) => void;
}

export default function SelectLoteConfirmacao({ lotes, selectLote }: Props) {
    return (
        <View style={styles.container}>
            {lotes.length > 0 ? (
                lotes.map((lote) => (
                    <TouchableOpacity key={lote.id} style={styles.card} onPress={() => selectLote(lote)}>
                        <View>
                            <Image
                                style={styles.img} 
                                source={require('../../../assets/icons/envios.png')}
                            />
                        </View>

                        <View>
                            <Text style={styles.title}>Barco: <Text style={styles.text}>{lote.barco}</Text></Text>

                            <Text style={styles.title}>Data: 
                                <Text style={styles.text}>
                                    {new Date(lote.data).toLocaleDateString('pt-BR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })}
                                </Text>
                            </Text>

                            <Text style={styles.title}>Peso: <Text style={styles.text}>{lote.pesoTotal} Kg</Text></Text>
                        </View>
                    </TouchableOpacity>
                ))
            ) : (
                <Text style={styles.noLoteText}>Nenhum lote encontrado.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#F1F5FF',
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#2C205E',
    },
    text: {
        color: '#4B465E',
        fontWeight: '400',
    },
    date: {
        fontSize: 16,
        color: '#666',
    },
    noLoteText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
    img: {
        width: 48
    },
});
