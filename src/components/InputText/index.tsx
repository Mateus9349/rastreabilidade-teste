import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from "react-native";

interface Props {
    label: string;
    placeholder: string;
    value: string;
    onChangeText?: (value: string) => void;
    keyboardType?: KeyboardTypeOptions;
    pointerEvents?: 'none' | 'auto';
}

export default function InputText({
    label,
    placeholder,
    value,
    onChangeText,
    keyboardType,
    pointerEvents,
}: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{label}:</Text>

            <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType || 'default'}
                pointerEvents={pointerEvents || 'auto'}
                editable={pointerEvents !== 'none'}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 'auto',
        minWidth: '50%'
    },
    title: {
        color: '#2C205E',
        marginBottom: 4
    },
    input: {
        height: 54,
        borderWidth: 1,
        borderRadius: 7,
        borderColor: "#D8D0F7",
        paddingHorizontal: 16,
        color: '#000'
    },
});

