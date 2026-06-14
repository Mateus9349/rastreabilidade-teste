import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { ActivityIndicator, Surface, useTheme } from 'react-native-paper';

import InputSelect from '../../../components/InputSelect';
import { useLagosPorComunidade } from '../../../hooks/LocalData/lago/useLagosPorComunidade';
import AppText from '../../../components/ui/AppText';

interface Props {
    comunidadeNome: string;
    value: string;
    handleValue: (lagoNome: string) => void;
    title?: string;
    errorMessage?: string;
    sortAlphabetically?: boolean;
}

export default function SelectLago({
    comunidadeNome,
    value,
    handleValue,
    title = 'Lago',
    errorMessage,
    sortAlphabetically = true,
}: Props) {
    const theme = useTheme();

    const {
        data: lagos,
        loading,
        error,
    } = useLagosPorComunidade({ nome: comunidadeNome });

    const labels = useMemo(() => {
        const nomes = lagos.map((l) => String(l.nome));

        return sortAlphabetically
            ? [...nomes].sort((a, b) => a.localeCompare(b))
            : nomes;
    }, [lagos, sortAlphabetically]);

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
                        borderColor: theme.colors.outline,
                        backgroundColor: theme.colors.surface,
                    },
                ]}
            >
                {isLoading ? (
                    <ActivityIndicator size="small" />
                ) : null}

                <AppText
                    variant="bodyMedium"
                    color={theme.colors.onSurfaceVariant}
                    style={isLoading ? styles.loadingText : undefined}
                >
                    {message}
                </AppText>
            </Surface>
        </Surface>
    );

    if (!comunidadeNome) {
        return renderFeedback('Selecione uma comunidade');
    }

    if (loading) {
        return renderFeedback('Carregando…', true);
    }

    if (error) {
        return renderFeedback('Erro ao carregar lagos');
    }

    if (labels.length === 0) {
        return renderFeedback(`Nenhum lago para “${comunidadeNome}”.`);
    }

    return (
        <InputSelect
            title={title}
            value={value}
            handleValue={handleValue}
            label={labels}
            errorMessage={errorMessage}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    label: {
        marginBottom: 6,
        fontWeight: '600',
    },
    feedbackBox: {
        minHeight: 48,
        borderWidth: 1,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    loadingText: {
        marginTop: 6,
    },
});
