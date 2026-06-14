import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
    Card,
    Surface,
    Text,
    TouchableRipple,
    useTheme,
} from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { useLocalCreateComunidades } from '../hooks/LocalData/comunidade/useLocalCreateComunidade';
import { useLocalComunidades } from '../hooks/LocalData/comunidade/useLocalComunidades';
import FormComunidade from '../components/FormComunidade/FormComunidade';
import SectionEditarComunidade from '../components/SectionEditarComunidade/SectionEditarComunidade';
import { useLocalUpdateComunidade } from '../hooks/LocalData/comunidade/useLocalUpdateComunidade';
import { useLocalDeleteComunidade } from '../hooks/LocalData/comunidade/useLocalDeleteComunidade';
import { IComunidade } from '../interfaces/Comunidade';

export default function Comunidades() {
    const theme = useTheme();
    const [menu, setMenu] = useState<' ' | 'add' | 'edit'>(' ');

    const { createComunidade } = useLocalCreateComunidades();
    const { comunidades, listarComunidades } = useLocalComunidades();
    const { updateComunidade } = useLocalUpdateComunidade();
    const { deleteComunidade } = useLocalDeleteComunidade();

    const handleCriarComunidade = async (comunidade: IComunidade) => {
        await createComunidade(comunidade);
        listarComunidades();
    };

    const handleExcluir = async (id: number) => {
        await deleteComunidade(id);
        listarComunidades();
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
                        style={[
                            styles.title,
                            { color: theme.colors.primary },
                        ]}
                    >
                        Comunidades
                    </Text>

                    <Text
                        variant="bodyMedium"
                        style={[
                            styles.subtitle,
                            { color: theme.colors.onSurfaceVariant },
                        ]}
                    >
                        Cadastre novas comunidades ou edite informações já registradas
                    </Text>
                </View>

                <View style={styles.body}>
                    {menu === 'add' && (
                        <KeyboardAwareScrollView
                            contentContainerStyle={styles.formScrollContent}
                            enableOnAndroid
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            <Surface
                                mode="elevated"
                                elevation={2}
                                style={[
                                    styles.formContainer,
                                    {
                                        backgroundColor: theme.colors.surface,
                                    },
                                ]}
                            >
                                <FormComunidade
                                    onSubmit={handleCriarComunidade}
                                />
                            </Surface>
                        </KeyboardAwareScrollView>
                    )}

                    {menu === 'edit' && (
                        <Surface
                            mode="elevated"
                            elevation={2}
                            style={[
                                styles.editContainer,
                                {
                                    backgroundColor: theme.colors.surface,
                                },
                            ]}
                        >
                            <SectionEditarComunidade
                                comunidades={comunidades}
                                editar={updateComunidade}
                                excluir={handleExcluir}
                                refetch={listarComunidades}
                            />
                        </Surface>
                    )}

                    {menu === ' ' && (
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
                                Escolha uma opção abaixo para começar.
                            </Text>
                        </Surface>
                    )}
                </View>

                <View style={styles.actions}>
                    <ComunidadeActionCard
                        title="Criar comunidade"
                        description="Adicione uma comunidade ao sistema"
                        onPress={() => setMenu('add')}
                        active={menu === 'add'}
                        icon={
                            <MaterialCommunityIcons
                                name="home-group-plus"
                                size={30}
                                color={theme.colors.onPrimary}
                            />
                        }
                    />

                    <ComunidadeActionCard
                        title="Editar comunidade"
                        description="Edite as informações da comunidade no sistema"
                        onPress={() => setMenu('edit')}
                        active={menu === 'edit'}
                        icon={
                            <MaterialCommunityIcons
                                name="home-group-remove"
                                size={30}
                                color={theme.colors.onPrimary}
                            />
                        }
                    />
                </View>
            </View>
        </Surface>
    );
}

type ComunidadeActionCardProps = {
    title: string;
    description: string;
    onPress: () => void;
    icon: React.ReactNode;
    active?: boolean;
};

function ComunidadeActionCard({
    title,
    description,
    onPress,
    icon,
    active = false,
}: ComunidadeActionCardProps) {
    const theme = useTheme();

    return (
        <Card
            mode="elevated"
            style={[
                styles.actionCard,
                {
                    backgroundColor: theme.colors.surface,
                    borderColor: active
                        ? theme.colors.primary
                        : theme.colors.outline,
                },
            ]}
        >
            <TouchableRipple onPress={onPress} borderless>
                <View style={styles.actionContent}>
                    <View
                        style={[
                            styles.iconContainer,
                            {
                                backgroundColor: theme.colors.primary,
                            },
                        ]}
                    >
                        {icon}
                    </View>

                    <Text
                        variant="titleMedium"
                        style={[
                            styles.actionTitle,
                            {
                                color: theme.colors.primary,
                            },
                        ]}
                    >
                        {title}
                    </Text>

                    <Text
                        variant="bodySmall"
                        style={[
                            styles.actionDescription,
                            {
                                color: theme.colors.onSurfaceVariant,
                            },
                        ]}
                    >
                        {description}
                    </Text>
                </View>
            </TouchableRipple>
        </Card>
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
        fontWeight: '700',
        marginBottom: 4,
    },
    subtitle: {},
    body: {
        flex: 1,
    },
    formScrollContent: {
        flexGrow: 1,
        paddingBottom: 16,
    },
    formContainer: {
        borderRadius: 20,
        padding: 16,
    },
    editContainer: {
        flex: 1,
        borderRadius: 20,
        padding: 16,
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
    actions: {
        flexDirection: 'row',
        gap: 15,
        justifyContent: 'center',
        marginTop: 25,
    },
    actionCard: {
        flex: 1,
        borderRadius: 20,
        borderWidth: 1,
        overflow: 'hidden',
    },
    actionContent: {
        minHeight: 165,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        width: 58,
        height: 58,
        borderRadius: 29,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    actionTitle: {
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 6,
    },
    actionDescription: {
        textAlign: 'center',
        lineHeight: 18,
    },
});