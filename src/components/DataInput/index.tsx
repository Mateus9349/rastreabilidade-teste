import React, { useState } from 'react';
import { View, Text, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface DateInputProps {
    label: string;
    value: Date;
    onChange: (date: Date) => void;
}

const DateInput: React.FC<DateInputProps> = ({ label, value, onChange }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (selectedDate) {
            onChange(selectedDate);
        }
        if (Platform.OS !== 'ios') {
            setShowDatePicker(false); // Fechar o picker no Android após seleção
        }
    };

    return (
        <View style={{width: '95%', alignSelf: 'center', marginTop: 10}}>
            <Text style={{ color: '#FFFFFF', marginBottom: 5 }}>{label}</Text>
            <TouchableOpacity style={styles.container} onPress={() => setShowDatePicker(true)}>
                <Text style={{ color: '#FFFFFF' }}>{value.toLocaleDateString('pt-BR')}</Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={value}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}
        </View>
    );
};

export default DateInput;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 'auto',
        minWidth: '50%',
        borderWidth: 1,
        borderColor: '#BBBBBB',
        borderRadius: 8,
        height: 44,
        marginBottom: 14
    }
});
