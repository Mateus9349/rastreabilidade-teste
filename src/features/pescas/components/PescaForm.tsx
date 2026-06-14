import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Surface, useTheme } from "react-native-paper";

import AppText from "../../../components/ui/AppText";
import { useFormularioPesca } from "../hooks/useFormularioPesca";
import { useValidarLacre } from "../hooks/useValidarLacre";
import { PescaFormData } from "../types/pesca.types";
import DadosBiometricosSection from "./DadosBiometricosSection";
import FormActions from "./FormActions";
import HorariosPescaSection from "./HorariosPescaSection";
import LacreInput from "./LacreInput";
import LocalPescaSection from "./LocalPescaSection";

interface Props {
    onSubmit: (dados: PescaFormData) => boolean | void | Promise<boolean | void>;
    dadosIniciais?: PescaFormData;
    isSubmitting?: boolean;
}

const isLacreBlocking = (status: ReturnType<typeof useValidarLacre>["status"]) =>
    status === "checking" || status === "duplicate" || status === "invalid";

export default function PescaForm({
    onSubmit,
    dadosIniciais,
    isSubmitting = false,
}: Props) {
    const theme = useTheme();
    const [internalSubmitting, setInternalSubmitting] = useState(false);
    const {
        formData,
        getVisibleError,
        reset,
        setFieldError,
        touchField,
        updateField,
        validateForm,
    } = useFormularioPesca(dadosIniciais);

    const effectiveSubmitting = isSubmitting || internalSubmitting;

    const lacreValidation = useValidarLacre(formData.lacre, {
        ignoredPeixeId: formData.id,
        enabled: !effectiveSubmitting,
    });

    const visibleErrors = {
        especie: getVisibleError("especie"),
        cat: getVisibleError("cat"),
        lacre: getVisibleError("lacre"),
        sexo: getVisibleError("sexo"),
        unidade: getVisibleError("unidade"),
        gona: getVisibleError("gona"),
        comprimento: getVisibleError("comprimento"),
        peso: getVisibleError("peso"),
        hPesca: getVisibleError("hPesca"),
        lago: getVisibleError("lago"),
        comunidade: getVisibleError("comunidade"),
        hEvisceramento: getVisibleError("hEvisceramento"),
    };

    const handleSubmit = async () => {
        const validation = validateForm();

        if (!validation.success) {
            return;
        }

        if (lacreValidation.status === "checking") {
            setFieldError("lacre", "Aguarde a validacao do lacre.");
            return;
        }

        if (lacreValidation.status === "duplicate") {
            setFieldError("lacre", lacreValidation.message);
            return;
        }

        setInternalSubmitting(true);

        try {
            const result = await onSubmit(validation.data);

            if (result !== false) {
                reset();
            }
        } finally {
            setInternalSubmitting(false);
        }
    };

    const lacreBlocksSubmit = isLacreBlocking(lacreValidation.status);

    return (
        <Surface
            style={[
                styles.screen,
                { backgroundColor: theme.colors.background },
            ]}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <Surface
                    style={[
                        styles.headerContainer,
                        { backgroundColor: "transparent" },
                    ]}
                    elevation={0}
                >
                    <AppText
                        variant="headlineSmall"
                        color={theme.colors.primary}
                        style={styles.title}
                    >
                        Preencha o formulario
                    </AppText>

                    <AppText
                        variant="bodyMedium"
                        color={theme.colors.onSurfaceVariant}
                        style={styles.subtitle}
                    >
                        Utilize as informacoes do pescado
                    </AppText>
                </Surface>

                <Surface
                    mode="elevated"
                    elevation={2}
                    style={[
                        styles.formCard,
                        {
                            backgroundColor: theme.colors.surface,
                            borderColor: theme.colors.outline,
                        },
                    ]}
                >
                    <Surface
                        style={[
                            styles.containerDados,
                            { backgroundColor: "transparent" },
                        ]}
                        elevation={0}
                    >
                        <LacreInput
                            value={formData.lacre}
                            validationState={lacreValidation}
                            errorMessage={visibleErrors.lacre}
                            onBlur={() => touchField("lacre")}
                            onChange={(value) => updateField("lacre", value)}
                        />

                        <DadosBiometricosSection
                            data={formData}
                            errors={visibleErrors}
                            onBlur={touchField}
                            onChange={updateField}
                        />

                        <HorariosPescaSection
                            data={formData}
                            errors={visibleErrors}
                            onBlur={touchField}
                            onChange={updateField}
                        />

                        <LocalPescaSection
                            data={formData}
                            errors={visibleErrors}
                            onChange={updateField}
                        />

                        <FormActions
                            disabled={effectiveSubmitting || lacreBlocksSubmit}
                            loading={effectiveSubmitting}
                            onSubmit={handleSubmit}
                        />
                    </Surface>
                </Surface>
            </ScrollView>
        </Surface>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        width: "100%",
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 32,
    },
    headerContainer: {
        marginBottom: 24,
        gap: 6,
    },
    title: {
        fontWeight: "700",
    },
    subtitle: {
        lineHeight: 20,
    },
    formCard: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 24,
        padding: 20,
    },
    containerDados: {
        flex: 1,
        gap: 20,
    },
});
