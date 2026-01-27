import React, { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "./style";

interface BotaoPescasProps {
    title: string;
    text: string;
    onPress: () => void;
    children: React.ReactNode;
}

export default function BotaoLink({
    title,
    text,
    onPress,
    children,
}: BotaoPescasProps) {
    const [pressed, setPressed] = useState(false);

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
        >
            {pressed ? (
                <LinearGradient
                    colors={["#630A0E", "#871B21"]}
                    style={styles.gradient}
                >
                    <View style={styles.content}>
                        <View style={styles.containerImagemText}>
                            {children}
                            <Text style={styles.title}>{title}</Text>
                        </View>
                        <Text style={styles.text}>{text}</Text>
                    </View>
                </LinearGradient>
            ) : (
                <View style={styles.content}>
                    <View style={styles.containerImagemText}>
                        {children}
                        <Text style={styles.title}>{title}</Text>
                    </View>
                    <Text style={styles.text}>{text}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}
