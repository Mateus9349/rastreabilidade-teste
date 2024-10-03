import { Picker } from "@react-native-picker/picker";
import { View, Text, StyleSheet } from "react-native";
import { IPeixe } from "../../types/Peixe";

interface Props {
    title: string;
    value: string;
    handleValue: (value: string) => void;
    label: string[];
}

export default function InputSelect({ title, value, handleValue, label }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{title}</Text>
            <View style={styles.containerPicker}>
                <Picker
                    selectedValue={value}
                    style={styles.picker}
                    onValueChange={handleValue}
                >
                    {label.map((item, index) => (
                        <Picker.Item style={styles.pickerItem} key={index} label={item} value={item} />
                    ))}
                </Picker>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        color: '#4B45E',
        fontFamily: 'Inter',
        marginBottom: 2
    },
    containerPicker: {
        borderWidth: 1,
        borderColor: '#D8D0F7',
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 5,
    },
    picker: {
        backgroundColor: '#ffffff',
    },
    pickerItem: {
        color: '#BBBBBB',
        fontSize: 14
    },
});