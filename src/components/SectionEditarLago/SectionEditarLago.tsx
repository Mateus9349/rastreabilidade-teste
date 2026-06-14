import { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { ILago } from '../../interfaces/Lago';
import FormLago from '../FormLago/FormLago';
import CardLago from '../CardLago/CardLago';

interface Props {
    lagos: ILago[];
    editar: (id: number, dados: Partial<ILago>) => void;
    excluir: (id: number) => void;
    refetch: () => void;
}

export default function SectionEditarLago({
    lagos,
    editar,
    excluir,
    refetch,
}: Props) {
    const theme = useTheme();
    const [selectedLago, setSelectedLago] = useState<ILago | null>(null);

    const handleEditarLago = async (dados: Partial<ILago>) => {
        if (selectedLago?.id != null) {
            editar(selectedLago.id, dados);
            setSelectedLago(null);
            refetch();
        }
    };

    if (selectedLago) {
        return (
            <KeyboardAwareScrollView
                contentContainerStyle={styles.formContent}
                enableOnAndroid
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <FormLago
                    lago={selectedLago}
                    onSubmit={handleEditarLago}
                />
            </KeyboardAwareScrollView>
        );
    }

    return (
        <FlatList
            data={lagos}
            keyExtractor={(item) =>
                item.id?.toString() ?? Math.random().toString()
            }
            renderItem={({ item }) => (
                <CardLago
                    lago={item}
                    editar={setSelectedLago}
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
                        Nenhum lago cadastrado.
                    </Text>
                </Surface>
            }
            contentContainerStyle={[
                styles.listContent,
                lagos.length === 0 && styles.emptyListContent,
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