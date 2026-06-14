import React from "react";
import { StyleSheet } from "react-native";
import { Surface } from "react-native-paper";

import { PescaFormData, PescaFormErrors } from "../types/pesca.types";
import HorarioInput from "./HorarioInput";

interface Props {
    data: PescaFormData;
    errors: PescaFormErrors;
    onBlur: (field: keyof PescaFormData) => void;
    onChange: (field: keyof PescaFormData, value: string) => void;
}

export default function HorariosPescaSection({
    data,
    errors,
    onBlur,
    onChange,
}: Props) {
    return (
        <Surface style={styles.row} elevation={0}>
            <Surface style={styles.fieldHalf} elevation={0}>
                <HorarioInput
                    label="Pesca"
                    value={data.hPesca}
                    errorMessage={errors.hPesca}
                    onBlur={() => onBlur("hPesca")}
                    onChange={(value) => onChange("hPesca", value)}
                />
            </Surface>

            <Surface style={styles.fieldHalf} elevation={0}>
                <HorarioInput
                    label="Evisceramento"
                    value={data.hEvisceramento}
                    errorMessage={errors.hEvisceramento}
                    onBlur={() => onBlur("hEvisceramento")}
                    onChange={(value) => onChange("hEvisceramento", value)}
                />
            </Surface>
        </Surface>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
        backgroundColor: "transparent",
    },
    fieldHalf: {
        flex: 1,
        backgroundColor: "transparent",
    },
});
