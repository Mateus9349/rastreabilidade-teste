import React from "react";

import { LacreValidationState } from "../types/pesca.types";
import SimpleFormInput from "./SimpleFormInput";

interface Props {
    value: string;
    errorMessage?: string;
    validationState: LacreValidationState;
    onBlur: () => void;
    onChange: (value: string) => void;
}

const getFeedback = (
    validationState: LacreValidationState,
    errorMessage?: string,
) => {
    if (errorMessage) {
        return { text: errorMessage, error: true };
    }

    if (validationState.status === "checking") {
        return { text: "Validando lacre...", error: false };
    }

    if (
        validationState.status === "duplicate" ||
        validationState.status === "invalid" ||
        validationState.status === "error"
    ) {
        return { text: validationState.message, error: true };
    }

    if (validationState.status === "available") {
        return { text: validationState.message, error: false };
    }

    return { text: undefined, error: false };
};

export default function LacreInput({
    value,
    errorMessage,
    validationState,
    onBlur,
    onChange,
}: Props) {
    const feedback = getFeedback(validationState, errorMessage);

    return (
        <SimpleFormInput
            label="Numero do lacre"
            placeholder="Digite o lacre"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            keyboardType="numeric"
            errorMessage={feedback.text}
            helperType={feedback.error ? "error" : "info"}
        />
    );
}
