import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Card, Text, TouchableRipple, useTheme } from 'react-native-paper';

type HomeOptionCardProps = {
    title: string;
    description: string;
    onPress: () => void;
    image?: number;
    icon?: React.ReactNode;
};

export default function HomeOptionCard({
    title,
    description,
    onPress,
    image,
    icon,
}: HomeOptionCardProps) {
    const theme = useTheme();

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
            <TouchableRipple onPress={onPress} borderless>
                <View style={styles.row}>
                    <View
                        style={[
                            styles.mediaContainer,
                            { backgroundColor: theme.colors.primary },
                        ]}
                    >
                        {image ? <Image source={image} style={styles.image} /> : icon}
                    </View>

                    <View style={styles.content}>
                        <Text
                            variant="titleMedium"
                            style={[
                                styles.title,
                                {
                                    color: theme.colors.primary, // 🔵 azul no título
                                },
                            ]}
                        >
                            {title}
                        </Text>

                        <Text
                            variant="bodySmall"
                            style={[
                                styles.description,
                                {
                                    color: theme.colors.onSurfaceVariant, // cinza secundário
                                },
                            ]}
                        >
                            {description}
                        </Text>
                    </View>
                </View>
            </TouchableRipple>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        marginBottom: 14,
        borderRadius: 18,
        borderWidth: 1,
        overflow: 'hidden',
    },
    row: {
        minHeight: 82,
        flexDirection: 'row',
        alignItems: 'stretch',
    },
    mediaContainer: {
        width: 72,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 18,
        borderBottomLeftRadius: 18,
    },
    image: {
        width: 34,
        height: 34,
        resizeMode: 'contain',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    title: {
        fontWeight: '700',
        marginBottom: 2,
    },
    description: {
        lineHeight: 18,
    },
});