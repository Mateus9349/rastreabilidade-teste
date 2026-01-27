import React, { useMemo } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useLocalComunidades } from "../../hooks/LocalData/comunidade/useLocalComunidades";
import InputSelect from "../InputSelect";

interface Props {
    title?: string;
    value?: string; // nome da comunidade selecionada
    onChange: (nome: string) => void; // retorna o nome da comunidade
    errorMessage?: string;
    /** Se true, ordena alfabeticamente por nome (default: true) */
    sortAlphabetically?: boolean;
}

export default function SelectComunidade({
    title = "Comunidade",
    value = "",
    onChange,
    errorMessage,
    sortAlphabetically = true,
}: Props) {
    const { comunidades, listarComunidades } = useLocalComunidades();

    // Lista de nomes para o Picker
    const labels = useMemo(() => {
        const nomes = comunidades.map((c) => c.nome);
        return sortAlphabetically ? [...nomes].sort((a, b) => a.localeCompare(b)) : nomes;
    }, [comunidades, sortAlphabetically]);

    // Estados simples de UX
    const isLoading = comunidades.length === 0;

    if (isLoading) {
        // Enquanto carrega a primeira vez
        return (
            <View style={{ gap: 8 }}>
                <Text style={{ color: "#EDF2FD", fontFamily: "Inter" }}>{title}</Text>
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: "#A4A4A4",
                        borderRadius: 5,
                        paddingVertical: 12,
                        alignItems: "center",
                    }}
                >
                    <ActivityIndicator />
                    <Text style={{ color: "#BBBBBB", marginTop: 6 }}>Carregando comunidades…</Text>
                </View>
            </View>
        );
    }

    // Caso não haja comunidades, mostra uma mensagem amigável
    if (labels.length === 0) {
        return (
            <View style={{ gap: 8 }}>
                <Text style={{ color: "#EDF2FD", fontFamily: "Inter" }}>{title}</Text>
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: "#A4A4A4",
                        borderRadius: 5,
                        paddingVertical: 12,
                        alignItems: "center",
                    }}
                >
                    <Text style={{ color: "#BBBBBB" }}>Nenhuma comunidade cadastrada</Text>
                    <Text
                        onPress={listarComunidades}
                        style={{ color: "#1a73e8", marginTop: 6, textDecorationLine: "underline" }}
                    >
                        Tentar novamente
                    </Text>
                </View>
            </View>
        );
    }

    // Render padrão usando seu InputSelect
    return (
        <InputSelect
            title={title}
            value={value}
            handleValue={onChange}
            label={labels}
            errorMessage={errorMessage}
        />
    );
}
