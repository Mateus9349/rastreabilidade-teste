import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from "react-native";

export default function CardGuiaDeTransporte({ lotes, remove }: { lotes: Object[] | undefined; remove: (id: number) => void }) {
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
                            onPress={() => Alert.alert('Banco de dados em nuvem ainda não estão ativos!')}
                            onLongPress={() => remove(lote.id)}
                        >
                            <Image source={require('../../../assets/icons/Enviar.png')} />
                            <Text style={styles.btnText1}>Enviar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btn2}>
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
