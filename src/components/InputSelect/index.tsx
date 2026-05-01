import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { HelperText, Surface, useTheme } from 'react-native-paper';

import AppText from '../../components/ui/AppText';

interface Props {
    title: string;
    value: string;
    handleValue: (value: string) => void;
    label: string[];
    errorMessage?: string;
}

export default function InputSelect({
    title,
    value = '',
    handleValue,
    label,
    errorMessage,
}: Props) {
    const theme = useTheme();
    const [touched, setTouched] = useState(false);

    const hasError = touched && value === '';

    return (
        <Surface style={styles.container} elevation={0}>
            <AppText variant="labelLarge" style={styles.label}>
                {title}
            </AppText>

            <Surface
                elevation={0}
                style={[
                    styles.containerPicker,
                    {
                        borderColor: hasError
                            ? theme.colors.error
                            : theme.colors.outline,
                        backgroundColor: theme.colors.surface,
                    },
                ]}
            >
                <Picker
                    selectedValue={value || ''}
                    style={[
                        styles.picker,
                        {
                            color: value
                                ? theme.colors.onSurface
                                : theme.colors.onSurfaceVariant,
                        },
                    ]}
                    dropdownIconColor={theme.colors.onSurfaceVariant}
                    onValueChange={(itemValue: string) => {
                        handleValue(itemValue);
                        setTouched(true);
                    }}
                >
                    <Picker.Item
                        label="Selecione uma opção"
                        value=""
                        color={theme.colors.onSurfaceVariant}
                    />

                    {label.map((item) => (
                        <Picker.Item
                            key={item}
                            label={item}
                            value={item}
                            color={theme.colors.onSurface}
                        />
                    ))}
                </Picker>
            </Surface>

            {hasError ? (
                <HelperText type="error" visible>
                    {errorMessage || 'Esse campo é obrigatório'}
                </HelperText>
            ) : null}
        </Surface>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    label: {
        marginBottom: 6,
        fontWeight: '600',
    },
    containerPicker: {
        minHeight: 48,
        borderWidth: 1,
        borderRadius: 12,
        overflow: 'hidden',
        justifyContent: 'center',
    },
    picker: {
        minHeight: 48,
        fontSize: 14,
    },
});