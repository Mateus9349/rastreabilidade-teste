import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import {
    Card,
    IconButton,
    Text,
    TouchableRipple,
    useTheme,
} from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { IComunidade } from '../../interfaces/Comunidade';

interface Props {
    comunidade: IComunidade;
    editar: (dados: IComunidade) => void;
    excluir: (id: number) => void;
}

export default function CardComunidade({
    comunidade,
    editar,
    excluir,
}: Props) {
    const theme = useTheme();

    const handleExcluir = () => {
        if (!comunidade.id) {
            return;
        }

        Alert.alert(
            'Confirmar exclusão',
            'Tem certeza que deseja excluir esta comunidade?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: () => {
                        if (comunidade.id) {
                            excluir(comunidade.id);
                        }
                    },
                },
            ]
        );
    };

    return (
        <Card
            mode="elevated"
            style={[
                styles.card,
                {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.outline,
                },
            ]}
        >
            <TouchableRipple onPress={() => editar(comunidade)} borderless>
                <View style={styles.row}>
                    <View
                        style={[
                            styles.iconContainer,
                            { backgroundColor: theme.colors.primary },
                        ]}
                    >
                        <MaterialCommunityIcons
                            name="home-group"
                            size={26}
                            color={theme.colors.onPrimary}
                        />
                    </View>

                    <View style={styles.content}>
                        <Text
                            variant="titleMedium"
                            numberOfLines={1}
                            style={[
                                styles.title,
                                { color: theme.colors.primary },
                            ]}
                        >
                            {comunidade.nome}
                        </Text>

                        <Text
                            variant="bodySmall"
                            style={[
                                styles.description,
                                { color: theme.colors.onSurfaceVariant },
                            ]}
                        >
                            Localização: {comunidade.latitude.toFixed(2)},{' '}
                            {comunidade.longitude.toFixed(2)}
                        </Text>
                    </View>

                    <View style={styles.actions}>
                        <IconButton
                            icon="pencil-outline"
                            size={24}
                            iconColor={theme.colors.primary}
                            onPress={() => editar(comunidade)}
                        />

                        <IconButton
                            icon="delete-outline"
                            size={24}
                            iconColor={theme.colors.error}
                            onPress={handleExcluir}
                        />
                    </View>
                </View>
            </TouchableRipple>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        borderWidth: 1,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
    },
    iconContainer: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    content: {
        flex: 1,
    },
    title: {
        fontWeight: '700',
        marginBottom: 4,
    },
    description: {
        lineHeight: 18,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },
});