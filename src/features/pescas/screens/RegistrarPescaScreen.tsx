import { useState } from "react";
import {
    Alert,
    ImageBackground,
    StyleSheet,
    TouchableWithoutFeedback,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Surface, Text, useTheme } from "react-native-paper";

import AppButton from "../../../components/ui/AppButton";
import { RootStackParamList } from "../../../navigation/types";
import PescaForm from "../components/PescaForm";
import { useRegistrarPesca } from "../hooks/useRegistrarPesca";
import { PescaFormData } from "../types/pesca.types";

type Props = NativeStackScreenProps<RootStackParamList, "RegistrarPeixe">;

export default function RegistrarPescaScreen({ navigation }: Props) {
    const theme = useTheme();
    const [pescaRegistrada, setPescaRegistrada] = useState(false);
    const { isSubmitting, registrarPesca } = useRegistrarPesca();

    const handleSubmit = async (dados: PescaFormData) => {
        const result = await registrarPesca(dados);

        if (!result.success) {
            Alert.alert("Erro ao registrar pescado", result.message);
            return false;
        }

        setPescaRegistrada(true);
        return true;
    };

    return (
        <Surface
            style={[
                styles.screen,
                { backgroundColor: theme.colors.background },
            ]}
        >
            {pescaRegistrada ? (
                <TouchableWithoutFeedback
                    onPress={() => setPescaRegistrada(false)}
                >
                    <ImageBackground
                        source={require("../../../../assets/img/fundoPescaRegistrada.png")}
                        style={styles.containerImage}
                        resizeMode="cover"
                    >
                        <Surface
                            mode="elevated"
                            elevation={2}
                            style={[
                                styles.feedbackCard,
                                {
                                    backgroundColor: theme.colors.surface,
                                    borderColor: theme.colors.outline,
                                },
                            ]}
                        >
                            <Surface
                                style={[
                                    styles.textContainer,
                                    { backgroundColor: "transparent" },
                                ]}
                            >
                                <Text
                                    variant="headlineSmall"
                                    style={[
                                        styles.mainText,
                                        { color: theme.colors.primary },
                                    ]}
                                >
                                    Pesca Registrada
                                </Text>

                                <Text
                                    variant="bodyMedium"
                                    style={[
                                        styles.secondaryText,
                                        {
                                            color: theme.colors.onSurfaceVariant,
                                        },
                                    ]}
                                >
                                    Sua pesca foi registrada com exito
                                </Text>
                            </Surface>

                            <AppButton
                                mode="contained"
                                onPress={() => setPescaRegistrada(false)}
                            >
                                Continuar
                            </AppButton>
                        </Surface>
                    </ImageBackground>
                </TouchableWithoutFeedback>
            ) : (
                <PescaForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            )}
        </Surface>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        width: "100%",
    },
    containerImage: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        width: "100%",
        height: "100%",
    },
    feedbackCard: {
        width: "100%",
        minHeight: "38%",
        justifyContent: "flex-end",
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 40,
        borderWidth: 1,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
    },
    textContainer: {
        alignItems: "center",
        marginBottom: 48,
        gap: 5,
        elevation: 0,
    },
    mainText: {
        fontWeight: "700",
        textAlign: "center",
    },
    secondaryText: {
        textAlign: "center",
    },
});
