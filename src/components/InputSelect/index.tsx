import { Picker } from "@react-native-picker/picker";
import { View, Text, StyleSheet } from "react-native";
import { useState } from "react";

interface Props {
    title: string;
    value: string;  // valor passado deve ser uma string
    handleValue: (value: string) => void;
    label: string[];
    errorMessage?: string;
}

export default function InputSelect({ title, value = "", handleValue, label, errorMessage }: Props) {
    const [touched, setTouched] = useState(false);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{title}</Text>
            <View style={styles.containerPicker}>
                <Picker
                    selectedValue={value || ""}  // garanta que o valor nunca seja undefined
                    style={styles.picker}
                    onValueChange={(itemValue) => {
                        handleValue(itemValue);
                        setTouched(true);
                    }}
                >
                    <Picker.Item label="Selecione uma opção" value="" />
                    {label.map((item, index) => (
                        <Picker.Item style={styles.pickerItem} key={index} label={item} value={item} />
                    ))}
                </Picker>
            </View>
            {touched && value === "" && (
                <Text style={styles.errorText}>{errorMessage || "Esse campo é obrigatório"}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        color: '#EDF2FD',
        fontFamily: 'Inter',
        marginBottom: 2
    },
    containerPicker: {
        borderWidth: 1,
        borderColor: '#A4A4A4',
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 5,
    },
    picker: {
        color: '#BBBBBB',
    },
    pickerItem: {
        color: '#EDF2FD', // Cor mais escura e forte
        fontSize: 14,
        fontWeight: 'bold', // Negrito para dar mais ênfase
        backgroundColor: '#1C1D1F'
    },
    errorText: {
        color: 'red',
        fontSize: 12,
    },
});
