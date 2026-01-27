import React, { useMemo } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import InputSelect from "../InputSelect"; // ajuste o caminho se necessário
import { useLagosPorComunidade } from "../../hooks/LocalData/lago/useLagosPorComunidade";

interface Props {
    comunidadeNome: string;              // nome da comunidade
    value: string;                       // nome do lago selecionado
    handleValue: (lagoNome: string) => void; // devolve o nome do lago
    title?: string;
    errorMessage?: string;
    sortAlphabetically?: boolean;        // default: true
}

export default function SelectLago({
    comunidadeNome,
    value,
    handleValue,
    title = "Lago",
    errorMessage,
    sortAlphabetically = true,
}: Props) {
    const { data: lagos, loading, error } = useLagosPorComunidade({ nome: comunidadeNome });

    const labels = useMemo(() => {
        const nomes = lagos.map((l: any) => String(l.nome));
        return sortAlphabetically ? [...nomes].sort((a, b) => a.localeCompare(b)) : nomes;
    }, [lagos, sortAlphabetically]);

    if (!comunidadeNome) {
        return (
            <View style={{ gap: 8, width: "47%" }}>
                <Text style={{ color: "#EDF2FD", fontFamily: "Inter" }}>{title}</Text>
                <View style={{ borderWidth: 1, borderColor: "#A4A4A4", borderRadius: 5, paddingVertical: 12, alignItems: "center" }}>
                    <Text style={{ color: "#BBBBBB" }}>Selecione uma comunidade</Text>
                </View>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={{ gap: 8, width: "47%" }}>
                <Text style={{ color: "#EDF2FD", fontFamily: "Inter" }}>{title}</Text>
                <View style={{ borderWidth: 1, borderColor: "#A4A4A4", borderRadius: 5, paddingVertical: 12, alignItems: "center" }}>
                    <ActivityIndicator />
                    <Text style={{ color: "#BBBBBB", marginTop: 6 }}>Carregando…</Text>
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ gap: 8, width: "47%" }}>
                <Text style={{ color: "#EDF2FD", fontFamily: "Inter" }}>{title}</Text>
                <View style={{ borderWidth: 1, borderColor: "#A4A4A4", borderRadius: 5, paddingVertical: 12, alignItems: "center" }}>
                    <Text style={{ color: "#BBBBBB" }}>Erro ao carregar lagos</Text>
                </View>
            </View>
        );
    }

    if (labels.length === 0) {
        return (
            <View style={{ gap: 8, width: "47%" }}>
                <Text style={{ color: "#EDF2FD", fontFamily: "Inter" }}>{title}</Text>
                <View style={{ borderWidth: 1, borderColor: "#A4A4A4", borderRadius: 5, paddingVertical: 12, alignItems: "center" }}>
                    <Text style={{ color: "#BBBBBB" }}>Nenhum lago para “{comunidadeNome}”.</Text>
                </View>
            </View>
        );
    }

    return (
        <InputSelect
            title={title}
            value={value}
            handleValue={handleValue}
            label={labels}
            errorMessage={errorMessage}
        />
    );
}
