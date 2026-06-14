import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    message: string;
}

export default class AppErrorBoundary extends React.Component<Props, State> {
    state: State = {
        hasError: false,
        message: "",
    };

    static getDerivedStateFromError(error: unknown): State {
        return {
            hasError: true,
            message:
                error instanceof Error
                    ? error.message
                    : "Ocorreu um erro inesperado.",
        };
    }

    componentDidCatch(error: unknown, info: React.ErrorInfo) {
        console.error("[ErrorBoundary] Erro inesperado", error, info.componentStack);
    }

    private handleRetry = () => {
        this.setState({ hasError: false, message: "" });
    };

    render() {
        if (!this.state.hasError) {
            return this.props.children;
        }

        return (
            <View style={styles.container}>
                <Text style={styles.title}>Algo deu errado.</Text>
                <Text style={styles.message}>{this.state.message}</Text>
                <Pressable style={styles.button} onPress={this.handleRetry}>
                    <Text style={styles.buttonText}>Tentar novamente</Text>
                </Pressable>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        backgroundColor: "#FFFFFF",
    },
    title: {
        marginBottom: 8,
        color: "#1C1D1F",
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
    },
    message: {
        marginBottom: 24,
        color: "#4B5563",
        fontSize: 14,
        textAlign: "center",
    },
    button: {
        minHeight: 44,
        justifyContent: "center",
        borderRadius: 8,
        backgroundColor: "#0F5B5F",
        paddingHorizontal: 18,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "700",
    },
});
