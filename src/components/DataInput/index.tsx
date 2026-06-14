import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
    Text,
    TouchableRipple,
    useTheme,
} from 'react-native-paper';

interface DateInputProps {
    label: string;
    value: Date;
    onChange: (date: Date) => void;
}

const DateInput: React.FC<DateInputProps> = ({
    label,
    value,
    onChange,
}) => {
    const theme = useTheme();
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (selectedDate) {
            onChange(selectedDate);
        }

        if (Platform.OS !== 'ios') {
            setShowDatePicker(false);
        }
    };

    return (
        <View style={styles.wrapper}>
            <Text
                variant="labelLarge"
                style={[
                    styles.label,
                    {
                        color: theme.colors.onSurfaceVariant,
                    },
                ]}
            >
                {label}
            </Text>

            <TouchableRipple
                onPress={() => setShowDatePicker(true)}
                borderless
                style={[
                    styles.container,
                    {
                        borderColor: theme.colors.outline,
                        backgroundColor: theme.colors.surface,
                    },
                ]}
            >
                <Text
                    variant="bodyMedium"
                    style={[
                        styles.value,
                        {
                            color: theme.colors.onSurface,
                        },
                    ]}
                >
                    {value.toLocaleDateString('pt-BR')}
                </Text>
            </TouchableRipple>

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
    wrapper: {
        width: '100%',
        gap: 6,
    },
    label: {
        fontWeight: '600',
    },
    container: {
        minHeight: 44,
        borderWidth: 1,
        borderRadius: 12,
        justifyContent: 'center',
        paddingHorizontal: 14,
        overflow: 'hidden',
    },
    value: {
        textAlign: 'left',
    },
});