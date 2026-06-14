import React from "react";
import { StyleSheet } from "react-native";
import { Surface } from "react-native-paper";

import { PescaFormData, PescaFormErrors } from "../types/pesca.types";
import SelectComunidade from "./SelectComunidade";
import SelectLago from "./SelectLago";

interface Props {
    data: PescaFormData;
    errors: PescaFormErrors;
    onChange: (field: keyof PescaFormData, value: string) => void;
}

export default function LocalPescaSection({
    data,
    errors,
    onChange,
}: Props) {
    return (
        <Surface style={styles.row} elevation={0}>
            <Surface style={styles.fieldHalf} elevation={0}>
                <SelectComunidade
                    title="Comunidade"
                    value={data.comunidade}
                    onChange={(value) => onChange("comunidade", value)}
                    errorMessage={errors.comunidade}
                />
            </Surface>

            <Surface style={styles.fieldHalf} elevation={0}>
                <SelectLago
                    title="Lago"
                    comunidadeNome={data.comunidade}
                    value={data.lago}
                    handleValue={(value) => onChange("lago", value)}
                    errorMessage={errors.lago}
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
