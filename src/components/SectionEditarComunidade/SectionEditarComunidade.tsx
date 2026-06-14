import { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { IComunidade } from '../../interfaces/Comunidade';
import CardComunidade from '../CardComunidade/CardComunidade';
import FormComunidade from '../FormComunidade/FormComunidade';

interface Props {
    comunidades: IComunidade[];
    editar: (id: number, dados: Partial<IComunidade>) => void;
    excluir: (id: number) => void;
    refetch: () => void;
}

export default function SectionEditarComunidade({
    comunidades,
    editar,
    excluir,
    refetch,
}: Props) {
    const theme = useTheme();
    const [selectedComunidade, setSelectedComunidade] =
        useState<IComunidade | null>(null);

    const handleEditarComunidade = async (dados: Partial<IComunidade>) => {
        if (selectedComunidade?.id != null) {
            editar(selectedComunidade.id, dados);
            setSelectedComunidade(null);
            refetch();
        }
    };

    if (selectedComunidade) {
        return (
            <KeyboardAwareScrollView
                contentContainerStyle={styles.formContent}
                enableOnAndroid
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <FormComunidade
                    comunidade={selectedComunidade}
                    onSubmit={handleEditarComunidade}
                    onCancel={() => setSelectedComunidade(null)}
                />
            </KeyboardAwareScrollView>
        );
    }

    return (
        <FlatList
            data={comunidades}
            keyExtractor={(item) =>
                item.id?.toString() ?? Math.random().toString()
            }
            renderItem={({ item }) => (
                <CardComunidade
                    comunidade={item}
                    editar={setSelectedComunidade}
                    excluir={excluir}
                />
            )}
            ListEmptyComponent={
                <Surface
                    mode="flat"
                    style={[
                        styles.emptyContainer,
                        {
                            backgroundColor: theme.colors.surfaceVariant,
                        },
                    ]}
                >
                    <Text
                        variant="bodyMedium"
                        style={[
                            styles.emptyText,
                            {
                                color: theme.colors.onSurfaceVariant,
                            },
                        ]}
                    >
                        Nenhuma comunidade cadastrada.
                    </Text>
                </Surface>
            }
            contentContainerStyle={[
                styles.listContent,
                comunidades.length === 0 && styles.emptyListContent,
            ]}
            showsVerticalScrollIndicator={false}
        />
    );
}

const styles = StyleSheet.create({
    formContent: {
        flexGrow: 1,
        paddingBottom: 16,
    },
    listContent: {
        paddingBottom: 16,
        gap: 12,
    },
    emptyListContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    emptyContainer: {
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        textAlign: 'center',
    },
});