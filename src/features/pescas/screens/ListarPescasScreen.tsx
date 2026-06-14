import { useState } from "react";
import {
    Alert,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ActivityIndicator, Surface, Text, useTheme } from "react-native-paper";

import AppButton from "../../../components/ui/AppButton";
import { RootStackParamList } from "../../../navigation/types";
import PescaForm from "../components/PescaForm";
import { usePescasRegistradas } from "../hooks/usePescasRegistradas";
import { PescaFormData } from "../types/pesca.types";

type Props = NativeStackScreenProps<RootStackParamList, "PeixesRegistrados">;

export default function ListarPescasScreen({ navigation }: Props) {
    const theme = useTheme();
    const [editingPeixeId, setEditingPeixeId] = useState<number | null>(null);
    const {
        atualizarPesca,
        carregarPescas,
        error,
        loading,
        pescas,
        removerPesca,
    } = usePescasRegistradas();

    const editarPesca = async (dados: PescaFormData, id?: number) => {
        if (!id) {
            Alert.alert("Erro", "ID invalido.");
            return false;
        }

        try {
            await atualizarPesca(id, dados);
            setEditingPeixeId(null);
            return true;
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Nao foi possivel atualizar o pescado.";
            Alert.alert("Erro ao atualizar pescado", message);
            return false;
        }
    };

    const confirmarRemocao = (id?: number) => {
        if (!id) {
            Alert.alert("Erro", "ID invalido.");
            return;
        }

        Alert.alert("Remover", "Deseja remover?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Sim",
                onPress: async () => {
                    try {
                        await removerPesca(id);
                    } catch (err) {
                        Alert.alert(
                            "Erro",
                            "Nao foi possivel remover o pescado.",
                        );
                    }
                },
            },
        ]);
    };

    return (
        <Surface
            style={[
                styles.screen,
                { backgroundColor: theme.colors.background },
            ]}
        >
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text
                        variant="headlineLarge"
                        style={[styles.title, { color: theme.colors.primary }]}
                    >
                        Pescas Atuais
                    </Text>

                    <Text
                        variant="bodyMedium"
                        style={[
                            styles.subtitle,
                            { color: theme.colors.onSurfaceVariant },
                        ]}
                    >
                        Confirme as informacoes de pescado como lacre e peso
                    </Text>
                </View>

                {error ? (
                    <Surface
                        mode="elevated"
                        elevation={1}
                        style={[
                            styles.emptyCard,
                            {
                                backgroundColor: theme.colors.surface,
                                borderColor: theme.colors.outline,
                            },
                        ]}
                    >
                        <Text
                            variant="bodyMedium"
                            style={{ color: theme.colors.onSurfaceVariant }}
                        >
                            {error.message}
                        </Text>
                        <AppButton mode="contained-tonal" onPress={carregarPescas}>
                            Tentar novamente
                        </AppButton>
                    </Surface>
                ) : null}

                <View style={styles.listContainer}>
                    {loading ? (
                        <ActivityIndicator size="large" />
                    ) : (
                        <FlatList
                            data={pescas}
                            keyExtractor={(item) => String(item.id)}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <View style={styles.cardWrapper}>
                                    <Surface
                                        mode="elevated"
                                        elevation={2}
                                        style={[
                                            styles.card,
                                            {
                                                backgroundColor: theme.colors.surface,
                                                borderColor: theme.colors.outline,
                                            },
                                        ]}
                                    >
                                        <View style={styles.cardContent}>
                                            <Surface
                                                mode="flat"
                                                style={[
                                                    styles.iconContainer,
                                                    { backgroundColor: theme.colors.primary },
                                                ]}
                                            >
                                                <Image
                                                    source={require("../../../../assets/icons/peixe.png")}
                                                    style={styles.fishIcon}
                                                />
                                            </Surface>

                                            <View style={styles.cardTexts}>
                                                <Text
                                                    variant="titleMedium"
                                                    style={[
                                                        styles.lacre,
                                                        { color: theme.colors.onSurface },
                                                    ]}
                                                >
                                                    {item.lacre}
                                                </Text>

                                                <Text
                                                    variant="bodySmall"
                                                    style={{
                                                        color: theme.colors.onSurfaceVariant,
                                                    }}
                                                >
                                                    Numero do lacre
                                                </Text>
                                            </View>
                                        </View>

                                        <Pressable
                                            onLongPress={() => confirmarRemocao(item.id)}
                                            onPress={() => {
                                                if (item.id !== undefined) {
                                                    setEditingPeixeId(
                                                        editingPeixeId === item.id
                                                            ? null
                                                            : item.id,
                                                    );
                                                }
                                            }}
                                            style={({ pressed }) => [
                                                styles.editButton,
                                                {
                                                    backgroundColor: theme.colors.primary,
                                                    opacity: pressed ? 0.75 : 1,
                                                },
                                            ]}
                                        >
                                            <Image
                                                source={require("../../../../assets/icons/editar.png")}
                                                style={styles.editIcon}
                                            />
                                        </Pressable>
                                    </Surface>

                                    {editingPeixeId === item.id ? (
                                        <View style={styles.formContainer}>
                                            <PescaForm
                                                dadosIniciais={item}
                                                onSubmit={(dadosEditados) =>
                                                    editarPesca(dadosEditados, item.id)
                                                }
                                            />
                                        </View>
                                    ) : null}
                                </View>
                            )}
                            ListEmptyComponent={() => (
                                <Surface
                                    mode="elevated"
                                    elevation={1}
                                    style={[
                                        styles.emptyCard,
                                        {
                                            backgroundColor: theme.colors.surface,
                                            borderColor: theme.colors.outline,
                                        },
                                    ]}
                                >
                                    <Text
                                        variant="bodyMedium"
                                        style={{ color: theme.colors.onSurfaceVariant }}
                                    >
                                        Lista vazia.
                                    </Text>
                                </Surface>
                            )}
                            contentContainerStyle={styles.listContent}
                        />
                    )}
                </View>

                <AppButton
                    mode="contained"
                    onPress={() => navigation.navigate("PrepararLote")}
                    style={styles.button}
                >
                    Preparar lote
                </AppButton>
            </View>
        </Surface>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingTop: 72,
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 28,
    },
    title: {
        fontWeight: "700",
        marginBottom: 4,
    },
    subtitle: {
        maxWidth: 320,
    },
    listContainer: {
        flex: 1,
    },
    listContent: {
        gap: 16,
        paddingBottom: 16,
    },
    cardWrapper: {
        gap: 12,
    },
    card: {
        minHeight: 84,
        borderRadius: 18,
        borderWidth: 1,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    cardContent: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
    },
    iconContainer: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: "center",
        justifyContent: "center",
    },
    fishIcon: {
        width: 32,
        height: 32,
        resizeMode: "contain",
    },
    cardTexts: {
        flex: 1,
    },
    lacre: {
        fontWeight: "700",
        marginBottom: 2,
    },
    editButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 12,
    },
    editIcon: {
        width: 24,
        height: 24,
        resizeMode: "contain",
    },
    formContainer: {
        marginTop: 4,
    },
    emptyCard: {
        borderRadius: 18,
        borderWidth: 1,
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
    },
    button: {
        marginTop: 8,
    },
});
