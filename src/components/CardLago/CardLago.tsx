import { View, Text, Alert, TouchableOpacity } from "react-native";
import { ILago } from "../../interfaces/Lago";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useLocalComunidades } from "../../hooks/LocalData/comunidade/useLocalComunidades";

interface Props {
    lago: ILago;
    editar: (dados: ILago) => void;
    excluir: (id: number) => void;
}

export default function CardLago({ lago, editar, excluir }: Props) {
    const { comunidades } = useLocalComunidades();

    const comunidade = comunidades.find((c) => c.id === lago.comunidadeId);

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                marginBottom: 20,
            }}
        >
            <MaterialCommunityIcons name="waves" size={24} color="blue" />

            <View style={{ marginLeft: 25, gap: 2 }}>
                <Text style={{ color: "white" }}>Nome: {lago.nome}</Text>
                <Text style={{ color: "white" }}>
                    Localização: {lago.latitude.toFixed(2)}, {lago.longitude.toFixed(2)}
                </Text>
                <Text style={{ color: "white" }}>
                    Comunidade: {comunidade ? comunidade.nome : "Não encontrada"}
                </Text>
            </View>

            <View style={{ flexDirection: "row", gap: 5, marginLeft: 25, alignItems: 'center' }}>
                <TouchableOpacity onPress={() => editar(lago)}>
                    <MaterialIcons name="edit-note" size={34} color="blue" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        if (lago.id) {
                            Alert.alert(
                                "Confirmar exclusão",
                                "Tem certeza que deseja excluir este lago?",
                                [
                                    { text: "Cancelar", style: "cancel" },
                                    {
                                        text: "Excluir",
                                        style: "destructive",
                                        onPress: () => excluir(lago.id!),
                                    },
                                ]
                            );
                        }
                    }}
                >
                    <AntDesign name="delete" size={24} color="red" />
                </TouchableOpacity>
            </View>
        </View>
    );
}
