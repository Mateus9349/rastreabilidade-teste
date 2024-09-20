import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";

const BotaoHome = ({ onPress, title, text, src }: { onPress: () => void; title: string; text: string; src: any }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Image style={styles.icon} source={src} />
            <View style={styles.containerText}>
                <Text style={styles.title}>{title}</Text>
                <Text>{text}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default BotaoHome;

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#F5F5F5', // Cor de fundo dos botões
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'row',
        height: 81,
        paddingVertical: 8,
        paddingHorizontal: 32,
        alignSelf: 'stretch',
        marginBottom: 16,
        alignContent: 'space-between'
    },

    icon: {
        width: 40, // Ajuste o tamanho da imagem conforme necessário
        height: 40,
        marginRight: 16,
        marginTop: 10
    },

    containerText: {
        display: 'flex', // No React Native, flex é padrão, então essa linha é opcional
        flexDirection: 'column', // Disposição dos itens na vertical (coluna)
        alignItems: 'flex-start', // Alinha os itens à esquerda (início da linha)
        flex: 1, // flexGrow: 1, flexShrink: 0, flexBasis: '0%' em uma única linha
    },

    title: {
        color: 'black', // Cor do texto dos botões
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4
    },

    text: {
        color: '#000', // Cor preta para o texto
        fontFamily: 'Inter', // Fonte Inter
        fontSize: 13, // Tamanho da fonte em px
        fontStyle: 'normal', // Estilo normal da fonte
        fontWeight: '700', // Peso da fonte (bold)
        lineHeight: 16.9, // Altura da linha, convertido para px
        marginBottom: 8
    },
});
