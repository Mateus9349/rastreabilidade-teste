import React from "react";

import AppButton from "../../../components/ui/AppButton";

interface Props {
    disabled: boolean;
    loading: boolean;
    onSubmit: () => void;
}

export default function FormActions({ disabled, loading, onSubmit }: Props) {
    return (
        <AppButton
            mode="contained"
            onPress={onSubmit}
            disabled={disabled}
            loading={loading}
        >
            {loading ? "Registrando..." : "Registrar"}
        </AppButton>
    );
}
