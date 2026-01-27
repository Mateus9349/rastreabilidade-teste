// BotaoHomeSlot.tsx
import React, { forwardRef, memo, PropsWithChildren } from "react";
import { Pressable, View, Text, StyleSheet, ImageStyle, ViewStyle, TextStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type BotaoHomeProps = PropsWithChildren<{
    onPress: () => void;
    title: string;
    text: string;
    /** largura/altura do slot do ícone */
    iconSize?: number;
    /** desabilita o botão */
    disabled?: boolean;
    /** overrides opcionais */
    style?: ViewStyle;
    titleStyle?: TextStyle;
    textStyle?: TextStyle;
    /** acessibilidade/testes */
    accessibilityLabel?: string;
    testID?: string;
}>;

/**
 * Botão com gradiente e slot de ícone via children.
 * Ex.: <BotaoHome onPress={...}><MaterialIcons name="map" size={28} color="#fff" /></BotaoHome>
 */
const BotaoHomeSlot = memo(
    forwardRef<View, BotaoHomeProps>(function BotaoHome(
        {
            onPress,
            title,
            text,
            iconSize = 40,
            disabled,
            style,
            titleStyle,
            textStyle,
            accessibilityLabel,
            testID,
            children,
        },
        ref
    ) {
        return (
            <Pressable
                ref={ref}
                onPress={onPress}
                disabled={disabled}
                accessibilityRole="button"
                accessibilityLabel={accessibilityLabel ?? title}
                testID={testID}
                style={[styles.buttonContainer, style, disabled && { opacity: 0.6 }]}
                android_ripple={{ color: "rgba(255,255,255,0.08)" }}
            >
                {({ pressed }) => (
                    <LinearGradient
                        colors={pressed ? ["#630A0E", "#871B21"] : ["rgb(95, 89, 92)", "rgb(33, 23, 28)"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={styles.gradient}
                    >
                        <View style={[styles.iconSlot, { width: iconSize, height: iconSize }]}>
                            {children /* <- ícone vai aqui */}
                        </View>

                        <View style={styles.containerText}>
                            <Text style={[styles.title, titleStyle]} numberOfLines={1}>
                                {title}
                            </Text>
                            <Text style={[styles.text, textStyle]} numberOfLines={2}>
                                {text}
                            </Text>
                        </View>
                    </LinearGradient>
                )}
            </Pressable>
        );
    })
);

export default BotaoHomeSlot;

const styles = StyleSheet.create({
    buttonContainer: {
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 28,
        height: 81,
        width: 350,
    },
    gradient: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 32,
        height: 81,
    },
    iconSlot: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
    },
    containerText: {
        flex: 1,
        flexDirection: "column",
        alignItems: "flex-start",
    },
    title: {
        color: "#F9F9F9",
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 4,
    },
    text: {
        color: "#F9F9F9",
        fontSize: 13,
        fontWeight: "700",
        lineHeight: 17,
    },
});
