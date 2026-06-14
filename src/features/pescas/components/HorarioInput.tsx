import { useState } from "react";
import { StyleSheet } from "react-native";
import { HelperText, TouchableRipple, useTheme } from "react-native-paper";
import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import AppText from "../../../components/ui/AppText";

interface Props {
    label: string;
    value: string;
    errorMessage?: string;
    onBlur: () => void;
    onChange: (value: string) => void;
}

export default function HorarioInput({
    label,
    value,
    errorMessage,
    onBlur,
    onChange,
}: Props) {
    const theme = useTheme();
    const [showPicker, setShowPicker] = useState(false);

    const onPickerChange = (
        event: DateTimePickerEvent,
        selectedDate?: Date,
    ) => {
        setShowPicker(false);
        onBlur();

        if (event.type === "dismissed" || !selectedDate) {
            return;
        }

        onChange(selectedDate.toISOString());
    };

    const formattedTime = value
        ? new Date(value).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        })
        : "Selecione a hora";

    return (
        <>
            <AppText variant="labelLarge" style={styles.label}>
                {label}
            </AppText>

            <TouchableRipple
                borderless
                onPress={() => setShowPicker(true)}
                style={[
                    styles.touchable,
                    {
                        borderColor: errorMessage
                            ? theme.colors.error
                            : theme.colors.outline,
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

            {showPicker ? (
                <DateTimePicker
                    value={value ? new Date(value) : new Date()}
                    mode="time"
                    display="spinner"
                    onChange={onPickerChange}
                />
            ) : null}
        </>
    );
}

const styles = StyleSheet.create({
    label: {
        marginBottom: 6,
        fontWeight: "600",
    },
    touchable: {
        minHeight: 48,
        borderWidth: 1,
        borderRadius: 12,
        justifyContent: "center",
        paddingHorizontal: 14,
    },
    touchableText: {
        fontSize: 14,
    },
});
