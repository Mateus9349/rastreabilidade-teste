import React, { useMemo } from "react";
import { StyleSheet } from "react-native";
import {
    ActivityIndicator,
    Surface,
    TouchableRipple,
    useTheme,
} from "react-native-paper";

import InputSelect from "../../../components/InputSelect";
import AppText from "../../../components/ui/AppText";
import { useLocalComunidades } from "../../../hooks/LocalData/comunidade/useLocalComunidades";

interface Props {
    title?: string;
    value?: string;
    onChange: (nome: string) => void;
    errorMessage?: string;
    sortAlphabetically?: boolean;
}

export default function SelectComunidade({
    title = "Comunidade",
    value = "",
    onChange,
    errorMessage,
    sortAlphabetically = true,
}: Props) {
    const theme = useTheme();
    const { comunidades, listarComunidades, loading, error } =
        useLocalComunidades();

    const labels = useMemo(() => {
        const nomes = comunidades.map((c) => c.nome);

        return sortAlphabetically
            ? [...nomes].sort((a, b) => a.localeCompare(b))
            : nomes;
    }, [comunidades, sortAlphabetically]);

    const renderFeedback = (message: string, isLoading = false) => (
        <Surface style={styles.container} elevation={0}>
            <AppText variant="labelLarge" style={styles.label}>
                {title}
            </AppText>

            <Surface
                elevation={0}
                style={[
                    styles.feedbackBox,
                    {
                        borderColor: errorMessage
                            ? theme.colors.error
                            : theme.colors.outline,
                        backgroundColor: theme.colors.surface,
                    },
                ]}
            >
                {isLoading ? <ActivityIndicator size="small" /> : null}

                <AppText
                    variant="bodyMedium"
                    color={theme.colors.onSurfaceVariant}
                    style={isLoading ? styles.feedbackText : undefined}
                >
                    {message}
                </AppText>

                {!isLoading && error ? (
                    <TouchableRipple
                        borderless
                        onPress={() => listarComunidades()}
                        style={styles.retryButton}
                    >
                        <AppText
                            variant="labelLarge"
                            color={theme.colors.primary}
                            style={styles.retryText}
                        >
                            Tentar novamente
                        </AppText>
                    </TouchableRipple>
                ) : null}
            </Surface>
        </Surface>
    );

    if (loading) {
        return renderFeedback("Carregando comunidades...", true);
    }

    if (error) {
        return renderFeedback("Erro ao carregar comunidades");
    }

    if (labels.length === 0) {
        return renderFeedback("Nenhuma comunidade cadastrada");
    }

    return (
        <InputSelect
            title={title}
            value={value}
            handleValue={onChange}
            label={labels}
            errorMessage={errorMessage}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent",
    },
    label: {
        marginBottom: 6,
        fontWeight: "600",
    },
    feedbackBox: {
        minHeight: 48,
        borderWidth: 1,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    feedbackText: {
        marginTop: 6,
    },
    retryButton: {
        marginTop: 8,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    retryText: {
        textDecorationLine: "underline",
    },
});
