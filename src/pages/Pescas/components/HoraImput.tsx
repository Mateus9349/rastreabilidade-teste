import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { HelperText, TouchableRipple, useTheme } from 'react-native-paper';
import DateTimePicker, {
    DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import { IPeixe } from '../../../interfaces/Peixe';
import AppText from '../../../components/ui/AppText';

interface InputHoraProps {
    dados: IPeixe;
    handleDateChange: (field: keyof IPeixe, value: string) => void;
    text: string;
    localArmazenamento: keyof IPeixe;
    errorMessage?: string;
}

export default function InputHora({
    dados,
    handleDateChange,
    text,
    localArmazenamento,
    errorMessage,
}: InputHoraProps) {
    const theme = useTheme();
    const [showDatePicker, setShowDatePicker] = useState(false);

    const value = dados[localArmazenamento] as string | undefined;

    const onChange = (
        event: DateTimePickerEvent,
        selectedDate?: Date,
    ) => {
        setShowDatePicker(false);

        if (selectedDate) {
            handleDateChange(localArmazenamento, selectedDate.toISOString());
        }
    };

    const formattedTime = value
        ? new Date(value).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        })
        : 'Selecione a hora';

    return (
        <>
            <AppText variant="labelLarge" style={styles.label}>
                {text}
            </AppText>

            <TouchableRipple
                borderless
                onPress={() => setShowDatePicker(true)}
                style={[
                    styles.touchable,
                    {
                        borderColor: theme.colors.outline,
                        backgroundColor: theme.colors.surface,
                    },
                ]}
            >
                <AppText
                    variant="bodyMedium"
                    style={styles.touchableText}
                    color={
                        value
                            ? theme.colors.onSurface
                            : theme.colors.onSurfaceVariant
                    }
                >
                    {formattedTime}
                </AppText>
            </TouchableRipple>

            {errorMessage ? (
                <HelperText type="error" visible>
                    {errorMessage}
                </HelperText>
            ) : null}

            {showDatePicker && (
                <DateTimePicker
                    value={value ? new Date(value) : new Date()}
                    mode="time"
                    display="spinner"
                    onChange={onChange}
                />
            )}
        </>
    );
}

const styles = StyleSheet.create({
    label: {
        marginBottom: 6,
        fontWeight: '600',
    },
    touchable: {
        minHeight: 48,
        borderWidth: 1,
        borderRadius: 12,
        justifyContent: 'center',
        paddingHorizontal: 14,
    },
    touchableText: {
        fontSize: 14,
    },
});