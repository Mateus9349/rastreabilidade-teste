import React from 'react';
import { StyleSheet } from 'react-native';
import { HelperText, TextInput, TextInputProps } from 'react-native-paper';

interface AppInputProps extends TextInputProps {
    sanitize?: (value: string) => string;
    helperText?: string;
    helperType?: 'error' | 'info';
}

const AppInput: React.FC<AppInputProps> = ({
    sanitize,
    onChangeText,
    helperText,
    helperType = 'error',
    error,
    ...props
}) => {
    const showHelper = Boolean(helperText) && (helperType === 'info' || error);

    return (
        <>
            <TextInput
                mode="outlined"
                dense
                error={error}
                {...props}
                onChangeText={(value: string) => {
                    const sanitizedValue = sanitize ? sanitize(value) : value;
                    onChangeText?.(sanitizedValue);
                }}
            />

            {showHelper ? (
                <HelperText
                    type={helperType}
                    visible={showHelper}
                    style={styles.helperText}
                >
                    {helperText}
                </HelperText>
            ) : null}
        </>
    );
};

const styles = StyleSheet.create({
    helperText: {
        marginTop: 2,
        paddingHorizontal: 0,
    },
});

export default AppInput;