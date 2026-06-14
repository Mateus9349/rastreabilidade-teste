import React from "react";
import { StyleSheet, View } from "react-native";

import InputSelect from "../../../components/InputSelect";
import {
    GONA_FEMEA_OPTIONS,
    GONA_MACHO_OPTION,
    SEXO_OPTIONS,
} from "../constants/pesca.constants";
import { PescaFormData, PescaFormErrors } from "../types/pesca.types";
import { sanitizeDecimalInput } from "../utils/normalizeDecimal";
import SimpleFormInput from "./SimpleFormInput";

interface Props {
    data: PescaFormData;
    errors: PescaFormErrors;
    onBlur: (field: keyof PescaFormData) => void;
    onChange: (field: keyof PescaFormData, value: string) => void;
}

export default function DadosBiometricosSection({
    data,
    errors,
    onBlur,
    onChange,
}: Props) {
    const gonadalOptions =
        data.sexo === "M"
            ? [GONA_MACHO_OPTION]
            : GONA_FEMEA_OPTIONS;

    return (
        <>
            <View style={styles.row}>
                <View style={styles.fieldHalf}>
                    <InputSelect
                        title="Sexo"
                        value={data.sexo}
                        handleValue={(value) => onChange("sexo", value)}
                        label={SEXO_OPTIONS}
                        errorMessage={errors.sexo}
                    />
                </View>

                <View style={styles.fieldHalf}>
                    <InputSelect
                        title="Estagio Gonodal"
                        value={data.gona}
                        handleValue={(value) => onChange("gona", value)}
                        label={gonadalOptions}
                        errorMessage={errors.gona}
                    />
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.fieldHalf}>
                    <SimpleFormInput
                        label="Peso"
                        placeholder="Digite o peso"
                        value={data.peso}
                        sanitize={sanitizeDecimalInput}
                        onBlur={() => onBlur("peso")}
                        onChangeText={(value) => onChange("peso", value)}
                        keyboardType="decimal-pad"
                        errorMessage={errors.peso}
                    />
                </View>

                <View style={styles.fieldHalf}>
                    <SimpleFormInput
                        label="Comprimento"
                        placeholder="Comprimento"
                        value={data.comprimento}
                        sanitize={sanitizeDecimalInput}
                        onBlur={() => onBlur("comprimento")}
                        onChangeText={(value) => onChange("comprimento", value)}
                        keyboardType="decimal-pad"
                        errorMessage={errors.comprimento}
                    />
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
    },
    fieldHalf: {
        flex: 1,
        minWidth: 140,
    },
});
