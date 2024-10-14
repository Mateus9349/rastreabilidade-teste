import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface Props {
    text: string;
    onPress: () => void;
}

export default function Botao({ text, onPress }: Props) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 44,
        borderRadius: 12,
        backgroundColor: '#200393',
    },
    text:{
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
})