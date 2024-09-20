import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { IPeixe } from "../../types/Peixe";

interface InputHoraProps {
    dados: IPeixe;
    handleDateChange: (field: keyof IPeixe, value: string) => void;
    text: string;
    localArmazenamento: keyof IPeixe; // Define que é uma chave de IPeixe
}

export default function InputHora({ dados, handleDateChange, text, localArmazenamento }: InputHoraProps) {
    const [showDatePicker, setShowDatePicker] = useState(false);

    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowDatePicker(false); // Esconde o DateTimePicker após a seleção
        if (selectedDate) {
            // Chamando o handleDateChange com o campo apropriado e a data selecionada formatada para string ISO
            handleDateChange(localArmazenamento, selectedDate.toISOString());
        }
    };

    return (
        <View>
            <Text>{text}</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Text>
                    {/* Usa o localArmazenamento dinamicamente */}
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
