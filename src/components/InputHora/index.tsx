import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { IPeixe } from "../../types/Peixe";

interface InputHoraProps {
    dados: IPeixe;
    handleDateChange: (field: keyof IPeixe, value: string) => void;
    text: string;
    localArmazenamento: keyof IPeixe;
}

export default function InputHora({ dados, handleDateChange, text, localArmazenamento }: InputHoraProps) {
    const [showDatePicker, setShowDatePicker] = useState(false);

    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            handleDateChange(localArmazenamento, selectedDate.toISOString());
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{text}</Text>
            <TouchableOpacity style={styles.touchable} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.touchableText}>
                    {dados[localArmazenamento]
                        ? new Date(dados[localArmazenamento] as string).toLocaleTimeString()
                        : 'Selecione a hora'}
                </Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={dados[localArmazenamento]
                        ? new Date(dados[localArmazenamento] as string)
                        : new Date()}
                    mode="time"
                    display="spinner"
                    onChange={onChange}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        color: '#2C205E',
        fontFamily: 'Inter',
        marginBottom: 2
    },
    touchable: {
        borderWidth: 1,
        borderColor: '#D8D0F7',
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#ffffff',
        marginBottom: 5,
        width: '95%'
    },
    touchableText: {
        color: '#2C205E',
        fontSize: 14,
    },
});

