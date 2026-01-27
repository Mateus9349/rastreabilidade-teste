import { TouchableOpacity, Text, StyleSheet, View, Image } from "react-native";
import { IPeixe } from "../../interfaces/Peixe";

interface ILote {
    id?: string;
    planilha: number; // Número da planilha associada ao lote
    comunidade: string; // Nome da comunidade do lote
    setor: string; // Setor relacionado ao lote
    assistente: string; // Nome do assistente responsável pelo lote
    barco: string; // Nome do barco usado para a pesca
    data: string; // Data do lote no formato ISO 8601
    apetrechos: string; // Tipo de apetrechos usados na pesca
    ambiente: string; // Ambiente onde foi feito o lote
    quantidade: number; // Quantidade total de peixes no lote
    quantidadeF: number; // Quantidade de peixes fêmeas no lote
    quantidadeM: number; // Quantidade de peixes machos no lote
    pesoTotal: number; // Peso total do lote em kg
    peixes: IPeixe[]; // IDs dos peixes pertencentes ao lote
    ativo: number; // Status do lote (1 para ativo, 0 para inativo)
    recebidoSalgadeira: boolean; // Indica se o lote foi recebido na salgadeira
    createdBy: string; // Usuário que está cadastrando o lote  
}

interface Props {
    lotes: ILote[];
    selectLote: (lote: ILote) => void;
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
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderWidth: 0.5,
        borderRadius: 10,
        borderColor: '#BBBBBB',
        padding: 15,
        marginVertical: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#EDF2FD',
    },
    text: {
        color: '#BBBBBB',
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
