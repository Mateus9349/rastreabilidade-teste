import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from "react-native";

interface Props {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (value: string) => void;
    keyboardType?: KeyboardTypeOptions;
}

export default function InputText({ label, placeholder, value, onChangeText, keyboardType }: Props) {
    return (
        <View style={styles.container}>
            <Text>{label}:</Text>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType || 'default'}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 'auto',
        minWidth: '50%'
    },
    input: {
        height: 54,
        borderWidth: 1,
        borderRadius: 7,
        borderColor: "#D8D0F7",
        paddingHorizontal: 16
    },
})