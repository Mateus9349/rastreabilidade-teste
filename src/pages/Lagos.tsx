import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
    Card,
    Surface,
    Text,
    TouchableRipple,
    useTheme,
} from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import FormLago from '../components/FormLago/FormLago';
import SectionEditarLago from '../components/SectionEditarLago/SectionEditarLago';

import { useLocalCreateLago } from '../hooks/LocalData/lago/useLocalCreateLago';
import { useLocalLagos } from '../hooks/LocalData/lago/useLocalLagos';
import { useLocalUpdateLago } from '../hooks/LocalData/lago/useLocalUpdateLago';
import { useLocalDeleteLago } from '../hooks/LocalData/lago/useLocalDeleteLago';

import { ILago } from '../interfaces/Lago';

export default function Lagos() {
    const theme = useTheme();
    const [menu, setMenu] = useState<' ' | 'add' | 'edit'>(' ');

    const { createLago } = useLocalCreateLago();
    const { lagos, listarLagos } = useLocalLagos();
    const { updateLago } = useLocalUpdateLago();
    const { deleteLago } = useLocalDeleteLago();

    const handleCriarLago = async (lago: ILago) => {
        await createLago(lago);
        listarLagos();
    };

    const handleExcluir = async (id: number) => {
        await deleteLago(id);
        listarLagos();
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
                        Lagos
                    </Text>

                    <Text
                        variant="bodyMedium"
                        style={[
                            styles.subtitle,
                            { color: theme.colors.onSurfaceVariant },
                        ]}
                    >
                        Cadastre novos lagos ou edite informações já registradas
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
                                <FormLago onSubmit={handleCriarLago} />
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
                            <SectionEditarLago
                                lagos={lagos}
                                editar={updateLago}
                                excluir={handleExcluir}
                                refetch={listarLagos}
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
                    <LagoActionCard
                        title="Criar lago"
                        description="Adicione um novo lago ao sistema"
                        onPress={() => setMenu('add')}
                        active={menu === 'add'}
                        icon={
                            <Ionicons
                                name="add-circle"
                                size={30}
                                color={theme.colors.onPrimary}
                            />
                        }
                    />

                    <LagoActionCard
                        title="Editar lagos"
                        description="Edite as informações dos lagos no sistema"
                        onPress={() => setMenu('edit')}
                        active={menu === 'edit'}
                        icon={
                            <MaterialIcons
                                name="edit-square"
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

type LagoActionCardProps = {
    title: string;
    description: string;
    onPress: () => void;
    icon: React.ReactNode;
    active?: boolean;
};

function LagoActionCard({
    title,
    description,
    onPress,
    icon,
    active = false,
}: LagoActionCardProps) {
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