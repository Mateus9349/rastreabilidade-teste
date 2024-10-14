import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

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
                        <Text style={styles.title}>Barco: {lote.barco}</Text>
                        <Text style={styles.date}>Data: {new Date(lote.data).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                        })}</Text>
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
        backgroundColor: '#f5f5f5',
    },
    card: {
        backgroundColor: '#fff',
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
        color: '#333',
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
});
