import { View, Text, Alert } from "react-native";
import { IComunidade } from "../../interfaces/Comunidade";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';

interface Props {
    comunidade: IComunidade;
    editar: (dados: IComunidade) => void;
    excluir: (id: number) => void;
}

export default function CardComunidade({ comunidade, editar, excluir }: Props) {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: 20 }}>
            <MaterialCommunityIcons name="home-group" size={24} color="white" />

            <View style={{ marginLeft: 25, gap: 2 }}>
                <Text style={{ color: 'white' }}>Nome: {comunidade.nome}</Text>
                <Text style={{ color: 'white' }}>Localização: {comunidade.latitude.toFixed(2)}, {comunidade.longitude.toFixed(2)}</Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 5, marginLeft: 25, alignItems: 'center' }}>
                <TouchableOpacity onPress={() => editar(comunidade)}>
                    <MaterialIcons name="edit-note" size={34} color="blue" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        if (comunidade.id) {
                            Alert.alert(
                                "Confirmar exclusão",
                                "Tem certeza que deseja excluir esta comunidade?",
                                [
                                    {
                                        text: "Cancelar",
                                        style: "cancel",
                                    },
                                    {
                                        text: "Excluir",
                                        style: "destructive", // iOS mostra em vermelho
                                        onPress: () => { if (comunidade.id) { excluir(comunidade.id) } },
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
    )
}