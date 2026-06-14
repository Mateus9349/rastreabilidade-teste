import React from "react";
import {
    KeyboardTypeOptions,
    StyleSheet,
    TextInput,
    TextInputProps,
    View,
} from "react-native";
import { HelperText, useTheme } from "react-native-paper";

import AppText from "../../../components/ui/AppText";

interface Props extends Omit<TextInputProps, "onChangeText" | "value"> {
    label: string;
    value: string;
    errorMessage?: string;
    helperType?: "error" | "info";
    keyboardType?: KeyboardTypeOptions;
    sanitize?: (value: string) => string;
    onChangeText: (value: string) => void;
}

export default function SimpleFormInput({
    label,
    value,
    errorMessage,
    helperType = "error",
    keyboardType = "default",
    sanitize,
    onChangeText,
    ...props
}: Props) {
    const theme = useTheme();
    const hasError = helperType === "error" && Boolean(errorMessage);

    return (
        <View style={styles.container}>
            <AppText variant="labelLarge" style={styles.label}>
                {label}
            </AppText>

            <TextInput
                {...props}
                value={value}
                keyboardType={keyboardType}
                placeholderTextColor={theme.colors.onSurfaceVariant}
                style={[
                    styles.input,
                    {
                        borderColor: hasError
                            ? theme.colors.error
                            : theme.colors.outline,
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.onSurface,
                    },
                ]}
                onChangeText={(nextValue) =>
                    onChangeText(sanitize ? sanitize(nextValue) : nextValue)
                }
            />

            {errorMessage ? (
                <HelperText type={helperType} visible style={styles.helperText}>
                    {errorMessage}
                </HelperText>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    label: {
        marginBottom: 6,
        fontWeight: "600",
    },
    input: {
        minHeight: 48,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 8,
        fontSize: 14,
    },
    helperText: {
        marginTop: 2,
        paddingHorizontal: 0,
    },
});
