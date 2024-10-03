import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";

export default function BotaoPescas({ title, text, src, OnPress }: { title: string; text: string; src: any; OnPress: () => void }) {
    return (
        <TouchableOpacity style={styles.container} onPress={OnPress}>
            <View style={styles.containerImagemText}>
                <Image style={styles.image} source={src} />
                <Text style={styles.title}>{title}</Text>
            </View>

            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 155,
        height: 180,
        paddingVertical: 32,
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        backgroundColor: '#E0E0E0'
    },
    containerImagemText: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'stretch',
        marginBottom: 8
    },
    image: {
        width: 46,
        height: 46,
        marginBottom: 8
    },
    title: {
        alignSelf: 'stretch',
        color: '#000',
        textAlign: 'center',
        fontFamily: 'Inter',
        fontSize: 13,
        fontStyle: 'normal',
        fontWeight: '700'
    },
    text: {
        alignSelf: 'stretch',
        color: '#000000',
        textAlign: 'center',
        fontFamily: 'Inter',
        fontSize: 11,
        fontStyle: 'normal',
        fontWeight: '300',
        lineHeight: 13.2,
    },
})