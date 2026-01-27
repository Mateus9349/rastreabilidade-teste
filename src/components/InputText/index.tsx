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
                placeholderTextColor="#BBBBBB"
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
        color: '#EDF2FD',
        marginBottom: 4
    },
    input: {
        height: 54,
        borderWidth: 1,
        borderRadius: 7,
        borderColor: "#A4A4A4",
        paddingHorizontal: 16,
        color: '#FFFFFF'
    },
});

